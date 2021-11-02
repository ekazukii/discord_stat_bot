import fetch from 'node-fetch';
import { Console } from "winston/lib/winston/transports";
import * as types from "../types";

/** Model of League of Legends commands */
export class LoLModel {

    apikey: string;
    champJSON: any;
    /**
     * Fetch champion.json file and cache it.
     * @param {String} apikey - Riot api keys see {@link https://developer.riotgames.com/docs/portal#product-registration_application-process|riot appication process}
     */
    constructor(apikey: string) {
        this.apikey = apikey;

        var self = this;
        fetch("http://ddragon.leagueoflegends.com/cdn/10.21.1/data/en_US/champion.json", {})
            .then((res: any) => res.json())
            .then((body: any) => {
                self.champJSON = body;
            })
            .catch((e: Error) => {
                console.error(e)
            });
    }

    /**
     * Fetch user statistics of player
     * @param {Object} options
     * @param {string} options.username - Summoner's username
     * @param {function(Object)} callback  - Callback statistics, list of stats : {@link LoLView#showUserStats}
     */
    getUserStats(options: {username: string}, callback: Function) {
        var self = this;
        var username = options.username;
        self.getSummonerByName(username).then((summoner: any) => {
            if (typeof summoner.id !== 'undefined') {
                var response = new types.LoLStats;
                var pid = summoner.id;
                var aid = summoner.accountId;
                var puuid = summoner.puuid;
                response.level = summoner.summonerLevel;

                var promises = [];
                promises.push(new Promise((resolve, reject) => {
                    fetch(`https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${pid}/?api_key=${self.apikey}`, {})
                        .then((res: any) => res.json())
                        .then((body: any) => {
                            var masteries = []
                            for (let i = 0; i < 3; i++) {
                                var mastery = new types.LoLMasteries;
                                mastery.level = body[i].championLevel;
                                mastery.points = body[i].championPoints;
                                mastery.name = self.getChampName(body[i].championId);
                                masteries.push(mastery)
                            }
                            resolve(masteries)
                        })
                }));
                
                promises.push(new Promise((resolve, reject) => {
                    fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${pid}?api_key=${self.apikey}`, {})
                        .then((res: any) => res.json())
                        .then((body: any) => {
                            if(typeof body[0] !== "undefined") {
                                resolve(body[0].tier + " " + body[0].rank);
                            } else {
                                resolve("UNRANKED");
                            }
                        })
                }));

                promises.push(new Promise((resolve, reject) => {
                    self.getMatchlist(puuid, 1).then((body: any) => {
                        var gameId = body[0];
                        self.getMatchInfo(gameId).then((body: any) => {
                            var participantId = self.getParticipantId(body, puuid);
                            var participant = self.getParticipant(body, participantId);
                            console.log(participant)
                            var match = new types.LoLLastMatch();

                            match.champ = participant.championName;
                            match.win = participant.win;
                            match.kills = participant.kills;
                            match.deaths = participant.deaths;
                            match.assists = participant.assists;
                            match.cs = self.getCSPerMinutes(participant, body.info.gameDuration);

                            resolve(match);
                        });
                    });
                }));

                Promise.all(promises).then((res: any) => {
                    response.masteries = res[0];
                    response.rank = res[1];
                    response.match = res[2];

                    callback(response);
                    
                });
            } else {
                var errRes = new types.ErrorResponse;
                errRes.error = true;
                errRes.error_desc = "user not found";
                callback(errRes);
            }
        });
    }

    /**
     * Fetch statistics about last 5 games of the two players
     * @param {Object} options 
     * @param {string} options.user1 - First summoner's username
     * @param {string} options.user2 - Second summoner's username
     * @param {function(Object)} callback  - Callback statistics to controller, list of stats : {@link ScoreArray}
     */
    comparePlayers(options: {user1: string, user2: string}, callback: Function) {
        var user1 = options.user1;
        var user2 = options.user2;
        var self = this;
        Promise.all([this.getSummonerByName(user1), this.getSummonerByName(user2)]).then((summs: any) => {
            if(typeof summs[0].id !== 'undefined' && typeof summs[1].id !== 'undefined') {
                Promise.all([self.getMatchlist(summs[0].puuid, 5, "normal"), self.getMatchlist(summs[1].puuid, 5, "normal")]).then((matchlists: any) => {                    
                    
                    function getPlayerScore(matchlist: Array<any>, aid: any) {
                        return new Promise((resolve, reject) => {
                            var promises: Array<Promise<Array<number>>> = [];
                            var score = [0,0,0,0,0,0,0,0]
                            for (let i = 0; i < matchlist.length; i++) {
                                promises.push(
                                    new Promise((resolve1, reject1) => {
                                        self.getMatchInfo(matchlist[i]).then((game: any) => {
                                            resolve1(self.getMatchScore(game, aid));
                                        })
                                    }
                                )); 
                            }

                            Promise.all(promises).then((scoresArray) => {
                                for (let i = 0; i < scoresArray.length; i++) {
                                    for (let j = 0; j < scoresArray[i].length; j++) {
                                        score[j] += scoresArray[i][j];
                                    }
                                }
                                
                                for (let i = 0; i < score.length; i++) {
                                    score[i] = Math.round(score[i]);
                                }

                                resolve(score)
                            })
                        })
                    }

                    var promise1 = getPlayerScore(matchlists[0], summs[0].puuid);
                    var promise2 = getPlayerScore(matchlists[1], summs[1].puuid);

                    Promise.all([promise1, promise2]).then((players: any) => {
                        callback({score1: players[0], score2: players[1]})
                    });
                });
            } else {
                var response = new types.ErrorResponse;
                response.error = true;
                response.error_desc = "user not found";
                callback(response);
            }
        });
        // Get matchlist
        // Choose only normal or ranked game
        // Calculate score
    }

    /**
     * Fetch creep score over last 5 games of the player
     * @param {Object} options
     * @param {string} options.username - Summoner's username
     * @param {function(Object)} callback  - Callback statistics to controller
     */
    getUserCS(options: {username: string, ngame: number}, callback: Function) {
        var self = this;
        var username = options.username;
        var ngame = options.ngame;

        self.getSummonerByName(username).then((summoner: any) => {
            if (typeof summoner.id !== 'undefined') {
                var aid = summoner.accountId;
                let puuid = summoner.puuid;
                self.getMatchlist(puuid, ngame).then((matchlist: Array<any>) => {
                    //console.log(matchlist)
                    var promises = [];
                    var cs: Array<number> = [];
                    for (let i = 0; i < matchlist.length; i++) {
                        promises.push(self.getMatchInfo(matchlist[i]).then((game: any) => {
                            //console.log(game)
                            //console.log(game.info.participants)
                            return new Promise((resolve1, reject1) => {
                                var pid = self.getParticipantId(game, puuid);
                                var participant = self.getParticipant(game, pid);
                                resolve1(self.getCSPerMinutes(participant, game.info.gameDuration));
                            })
                        }));
                    }

                    Promise.all(promises).then((values: any) => {
                        callback({cs: values});
                    });
                });

                //callback({cs: [12, 34, 43, 32]});

                /**self.getClassicMatchlist(puuid, ngame).then((matchlist: Array<any>) => {

                    var promises = [];
                    var cs: Array<number> = [];
                    for (let i = 0; i < matchlist.length; i++) {
                        promises.push(self.getMatchInfo(matchlist[i].gameId).then((game: any) => {
                            return new Promise((resolve1, reject1) => {
                                var pid = self.getParticipantId(game, aid);
                                var participant = self.getParticipant(game, pid);
                                resolve1(self.getCSPerMinutes(participant.stats,  game.gameDuration));
                            })
                        }));
                    }

                    Promise.all(promises).then((values: any) => {
                        callback({cs: values});
                    });
                });*/
            }
        });
    }

    /**
     * Fetch current free champions.
     * @param {function(Object)} callback  - Callback statistics to controller
     * @private
     */
    getChampionRotation(callback: Function) {
        var champList: Array<string> = [];
        var self = this;
        fetch(`https://euw1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${this.apikey}`, {})
            .then((res: any) => res.json())
            .then((body: any) => {
                for (let i = 0; i < body.freeChampionIds.length; i++) {
                    const champId = body.freeChampionIds[i];
                    champList.push(self.getChampName(champId));
                }
                callback(champList);
            });
    }

    /**
     * Connvert championId to the english champion name
     * @param {number} champId - {@link https://riot-api-libraries.readthedocs.io/en/latest/ddragon.html|see ddragon wiki} 
     * @returns {string} english name of the champion
     * @private
     */
    getChampName(champId: number) {
        for (const key in this.champJSON.data) {
            if(this.champJSON.data[key].key == champId) {
                return key;
            }
        }
        return "NOTACHAMP"
    }

    /**
     * Fetch account information by his username
     * @param {string} username 
     * @param {function(Object)} callback - Callback summoners account information
     * @private
     */
    getSummonerByName(username: string) {
        return fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}/?api_key=${this.apikey}`, {}).then((res: any) => res.json())
    }
    
    /**
     * Fatch the last n match of the player
     * @param {string} puuid - puuid of the player
     * @param {number} number - Number of match to fetch
     * @param {function(Object)} callback - Callback the matchlist object.
     * @private
     */
    getMatchlist(puuid: string, number: number, filter?: string) {
        if(filter == "normal" || filter == "ranked") {
            return fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?api_key=${this.apikey}&count=${number}&type=${filter}`, {}).then((res: any) => res.json())
        } else {
            return fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?api_key=${this.apikey}&count=${number}`, {}).then((res: any) => res.json())
        }
    }

    /**
     * Fetch the last n "classic" match of the player. Classic matchs contains 5v5 Blind, 5v5 Normal Draft, Solo/Duo queue ranked, 5v5 Flex Ranked
     * @param {string} accountId - account id of the player
     * @param {number} number - Number of match to fetch
     * @param {function(Object)} callback - Callback the matchlist object.
     * @deprecated Use getMatchlist with filter instead
     * @private
     */
    getClassicMatchlist(accountId: string, number: number) {
        return new Promise((resolve, reject) => {
            var matchlist: Array<any> = [];
            this.getMatchlist(accountId, number*5).then((body: any) => {
                var i = 0;
                while(matchlist.length !== number && i !== body.matches.length-1) {
                    const match = body.matches[i];
                    if(match.queue === 400 || match.queue === 420 || match.queue === 430 || match.queue === 440) {
                        matchlist.push(match);
                    }
                    i++;
                }
    
                resolve(matchlist);
            })
        });
    }

    /**
     * Calculate the score of the player in the match by his statistics. Following our custom {@link https://github.com/ekazukii/discord_stat_bot/issues/6|score formula}
     * @param {Object} match - {@link https://developer.riotgames.com/apis#match-v4/GET_getMatch|Match object}
     * @param {string} accountId - Account id of the player
     * @returns {number} Score of the player on the match.
     * @private
     */
    getMatchScore(match: any, accountId: string) {
        var pid = this.getParticipantId(match, accountId);
        var participant = this.getParticipant(match, pid);
        //var team = this.getTeam(match, participant);
        var score = new Array();

        if(participant.win) {
            score.push(20);
        } else {
            score.push(0);
        }

        score.push(participant.kills * 3);
        score.push(participant.deaths * -3);
        score.push(participant.assists);
        score.push(this.getCSPerMinutes(participant, match.info.gameDuration));
        score.push((participant.timeCCingOthers * 4) / (match.info.gameDuration / 60));
        score.push(participant.totalDamageDealtToChampions / ( (match.info.gameDuration * 125) / 60));
        score.push(participant.totalDamageTaken / ( (match.info.gameDuration * 150) / 60));
        return score;
    }

    /**
     * Get match information suchs as player stats list of pick/ban by the match identifier
     * @param {number} gameId - Match unique id
     * @param {function(Object)} callback - Callback {@link https://developer.riotgames.com/apis#match-v4/GET_getMatch|Match object}
     * @private
     */
    getMatchInfo(gameId: number) {
        return fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${gameId}?api_key=${this.apikey}`, {}).then((res: any) => res.json())
    }

    /**
     * Get the id (it can be : 1,2,3,...,9,10) of a participant in the game
     * @param {Object} game - {@link https://developer.riotgames.com/apis#match-v4/GET_getMatch|Match object}
     * @param {string} accountId - Account id of the player
     * @returns {number} Id of the player in the match.
     * @private
     */
    getParticipantId(game: any, accountId: string) {
        for (let i = 0; i < game.metadata.participants.length; i++) {
            const puuid = game.metadata.participants[i];
            //console.log(puuid, accountId);
            if(puuid === accountId) {
                return i;
                //return element.participantId;
            }
        }
    }

    /**
     * Get the participant object from the participantId
     * @param {Object} game - {@link https://developer.riotgames.com/apis#match-v4/GET_getMatch|Match object}
     * @param {number} participantId - {@link LoLModel#getParticipantId}
     * @returns {Object} Player Object in the match 
     * @private
     */
    getParticipant(game: any, participantId: number) {
        //console.log(game.info.participants[participantId]);
        return game.info.participants[participantId];

        /** api v4 version
        for (let i = 0; i < game.participants.length; i++) {
            const player = game.participants[i];
            if(player.participantId === participantId) {
                return player;
            }
        }
         */
    }

    /**
     * Get team of participant
     * @param {Object} game - {@link https://developer.riotgames.com/apis#match-v4/GET_getMatch|Match object}
     * @param {Object} participant - {@link LoLModel#getParticipant}
     * @private
     */
    getTeam(game: any, participant: any) {
        for (let i = 0; i < game.teams.length; i++) {
            const element = game.teams[i];
            if(game.teams[i].teamId === participant.teamId) {
                return element;
            }
        }
    }

    /**
     * Get CS/min of the player in a match (CS/min is rounded after one decimal (example -> 7,6))
     * @param {Object} stats - Stats object of a participant {@link LoLModel#getParticipant} 
     * @param {number} gameDuration - Duration of the match in seconds
     * @returns {number} Creep Score per minutes.
     * @private
     */
    getCSPerMinutes(stats: any, gameDuration: number) {
        return Math.round( (stats.totalMinionsKilled + stats.neutralMinionsKilled) / (gameDuration / 60) * 10) / 10;
    }
}