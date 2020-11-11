// @ts-ignore
import * as request from "request";
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
        request("http://ddragon.leagueoflegends.com/cdn/10.21.1/data/en_US/champion.json", { json: true }, (err: Error, res: any, body: any) => {
            if (err) { return console.log(err); }
            self.champJSON = body;
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
        self.getSummonerByName(username, (summoner: any) => {
            if (typeof summoner.id !== 'undefined') {
                var response = new types.LoLStats;
                var pid = summoner.id;
                var aid = summoner.accountId;
                response.level = summoner.summonerLevel;
                response.masteries = [];
                request(`https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${pid}/?api_key=${self.apikey}`, { json: true }, (err: Error, res: any, body: any) => {
                    
                    for (let i = 0; i < 3; i++) {
                        var mastery = new types.LoLMasteries;
                        mastery.level = body[i].championLevel;
                        mastery.points = body[i].championPoints;
                        mastery.name = self.getChampName(body[i].championId);
                        response.masteries.push(mastery);
                    }

                    request(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${pid}?api_key=${self.apikey}`, { json: true }, (err: Error, res: any, body: any) => {
                        if (err) { return console.log(err); }
                        if(typeof body[0] !== "undefined") {
                            response.rank = body[0].tier + " " + body[0].rank;
                        } else {
                            response.rank = "UNRANKED";
                        }

                        self.getMatchlist(aid, 1, (body: any) => {
                            var gameId = body.matches[0].gameId;

                            self.getMatchInfo(gameId, (body: any) => {
                                var participantId = self.getParticipantId(body, aid);
                                var participant = self.getParticipant(body, participantId);

                                response.match.champ = self.getChampName(participant.championId);
                                response.match.win = participant.stats.win;
                                response.match.kills = participant.stats.kills;
                                response.match.deaths = participant.stats.deaths;
                                response.match.assists = participant.stats.assists;
                                response.match.cs = self.getCSPerMinutes(participant.stats, body.gameDuration);

                                callback(response);
                
                            })
                        })
                    });
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
        this.getSummonerByName(user1, (summ1: any) => {
            self.getSummonerByName(user2, (summ2: any) => {
                if(typeof summ1.id !== 'undefined' && typeof summ2.id !== 'undefined') {
                    var aid1 = summ1.accountId;
                    var aid2 = summ2.accountId;

                    self.getClassicMatchlist(aid1, 5, (matchlist1: Array<any>) => {
                        self.getClassicMatchlist(aid2, 5, (matchlist2: Array<any>) => {


                            // PUT IN METHOD INSTEAD OF IN FUNCTION IN FUNCTION
                            function getMatchlistScore(index: number, matchlist: Array<any>, score: Array<number>, aid: string, callback: Function) {
                                if(index <= matchlist1.length - 1) {
                                    self.getMatchInfo(matchlist[index].gameId, (game: any) => {
                                        var newScore = self.getMatchScore(game, aid);
                                        for (let i = 0; i < score.length; i++) {
                                            score[i] += newScore[i];
                                        }
                                        index++;
                                        getMatchlistScore(index, matchlist, score, aid, callback);
                                    });
                                } else {
                                    for (let i = 0; i < score.length; i++) {
                                        score[i] = Math.round(score[i]);
                                    }
                                    callback(score)
                                }
                            }

                            const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue;
                            getMatchlistScore(0, matchlist1, [0,0,0,0,0,0,0,0], aid1, (score1: Array<number>) => {
                                getMatchlistScore(0, matchlist2, [0,0,0,0,0,0,0,0], aid2, (score2: Array<number>) => {
                                    callback({score1: score1, score2: score2});
                                });
                            });
                        })
                    })
                } else {
                    var response = new types.ErrorResponse;
                    response.error = true;
                    response.error_desc = "user not found";
                    callback(response);
                }
            })
        })
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

        self.getSummonerByName(username, (summoner: any) => {
            if (typeof summoner.id !== 'undefined') {
                var aid1 = summoner.accountId;
                self.getClassicMatchlist(aid1, ngame, (matchlist1: Array<any>) => {

                    // SAME PUT IN METHOD
                    function getMathlistCS(index: number, matchlist: Array<any>, cs: Array<number>, aid: string, callback: Function) {
                        if(index <= matchlist1.length - 1) {
                            self.getMatchInfo(matchlist[index].gameId, (game: any) => {

                                var pid = self.getParticipantId(game, aid);
                                var participant = self.getParticipant(game, pid);

                                cs.push(self.getCSPerMinutes(participant.stats,  game.gameDuration));

                                index++;
                                getMathlistCS(index, matchlist, cs, aid, callback);
                            });
                        } else {
                            callback(cs);
                        }
                    }

                    getMathlistCS(0, matchlist1, [], aid1, (cs1: Array<number>) => {
                        callback({cs: cs1});
                    });

                });
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
        request(`https://euw1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${this.apikey}`, {json: true}, (err: Error, res: any, body: any) => {
            if (err) { return console.log(err); }
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
    getSummonerByName(username: string, callback: Function) {
        request(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}/?api_key=${this.apikey}`, {json: true}, (err: Error, res: any, body: any) => {
            if (err) { return console.log(err); }
            callback(body);
        });
    }
    
    /**
     * Fatch the last n match of the player
     * @param {string} accountId - account id of the player
     * @param {number} number - Number of match to fetch
     * @param {function(Object)} callback - Callback the matchlist object.
     * @private
     */
    getMatchlist(accountId: string, number: number, callback: Function) {
        request(`https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?api_key=${this.apikey}&endIndex=${number}`, { json: true }, (err: Error, res: any, body: any) => {
            if (err) { return console.log(err); }
            callback(body);
        });
    }

    /**
     * Fetch the last n "classic" match of the player. Classic matchs contains 5v5 Blind, 5v5 Normal Draft, Solo/Duo queue ranked, 5v5 Flex Ranked
     * @param {string} accountId - account id of the player
     * @param {number} number - Number of match to fetch
     * @param {function(Object)} callback - Callback the matchlist object.
     * @private
     */
    getClassicMatchlist(accountId: string, number: number, callback: Function) {
        var matchlist: Array<any> = [];
        this.getMatchlist(accountId, number*5, (body: any) => {
            var i = 0;
            while(matchlist.length !== number && i !== body.matches.length-1) {
                const match = body.matches[i];
                if(match.queue === 400 || match.queue === 420 || match.queue === 430 || match.queue === 440) {
                    matchlist.push(match);
                }
                i++;
            }

            callback(matchlist);
        })
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
        var team = this.getTeam(match, participant);
        var score = new Array();

        if(team.win === "Win") {
            score.push(20);
        } else {
            score.push(0);
        }

        score.push(participant.stats.kills * 3);
        //console.log("kills: " + participant.stats.kills * 3 + " : "  + score)
        score.push(participant.stats.deaths * -3);
        //console.log("death: " + participant.stats.deaths * -3 + " : "  + score)
        score.push(participant.stats.assists);
        //console.log("assists: " + participant.stats.assists + " : "  + score)
        score.push(this.getCSPerMinutes(participant.stats, match.gameDuration));
        //console.log("cs: " + this.getCSPerMinutes(participant.stats, match.gameDuration) + " : "  + score);
        score.push((participant.stats.timeCCingOthers * 4) / (match.gameDuration / 60));
        //console.log("cc: " + (participant.stats.timeCCingOthers * 4) / (match.gameDuration / 60) + " : "  + score)
        score.push(participant.stats.totalDamageDealtToChampions / ( (match.gameDuration * 125) / 60));
        //console.log("damage: " + participant.stats.totalDamageDealtToChampions / ( (match.gameDuration * 125) / 60) + " : "  + score)
        score.push(participant.stats.totalDamageTaken / ( (match.gameDuration * 150) / 60));
        //console.log("tank: " + participant.stats.totalDamageTaken / ( (match.gameDuration * 150) / 60) + " : "  + score)
        return score;
    }

    /**
     * Get match information suchs as player stats list of pick/ban by the match identifier
     * @param {number} gameId - Match unique id
     * @param {function(Object)} callback - Callback {@link https://developer.riotgames.com/apis#match-v4/GET_getMatch|Match object}
     * @private
     */
    getMatchInfo(gameId: number, callback: Function) {
        request(`https://euw1.api.riotgames.com/lol/match/v4/matches/${gameId}?api_key=${this.apikey}`, { json: true }, (err: Error, res: any, body: any) => {
            if (err) { return console.log(err); }
            callback(body);
        });
    }

    /**
     * Get the id (it can be : 1,2,3,...,9,10) of a participant in the game
     * @param {Object} game - {@link https://developer.riotgames.com/apis#match-v4/GET_getMatch|Match object}
     * @param {string} accountId - Account id of the player
     * @returns {number} Id of the player in the match.
     * @private
     */
    getParticipantId(game: any, accountId: string) {
        for (let i = 0; i < game.participantIdentities.length; i++) {
            const element = game.participantIdentities[i];
            if(element.player.accountId === accountId) {
                return element.participantId;
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
        for (let i = 0; i < game.participants.length; i++) {
            const player = game.participants[i];
            if(player.participantId === participantId) {
                return player;
            }
        }
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
        return Math.round( (stats.totalMinionsKilled + stats.neutralMinionsKilledTeamJungle + stats.neutralMinionsKilledEnemyJungle) / (gameDuration / 60) * 10) / 10;
    }
}