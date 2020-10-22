"use strict";
const request = require('request');

module.exports = class LoLModel {
    constructor(apikey) {
        this.apikey = apikey;

        var self = this;
        request("http://ddragon.leagueoflegends.com/cdn/10.21.1/data/en_US/champion.json", { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            self.champJSON = body;
        });
    }

    getUserStats(options, callback) {
        var self = this;
        var username = options.username;
        var response = {}
        self.getSummonerByName(username, (summoner) => {
            if (typeof summoner.id !== 'undefined') {
                var pid = summoner.id;
                var aid = summoner.accountId;
                response.level = summoner.summonerLevel;
                response.masteries = [];
                request(`https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${pid}/?api_key=${self.apikey}`, { json: true }, (err, res, body) => {
                    
                    for (let i = 0; i < 3; i++) {
                        var mastery = {}
                        mastery.level = body[i].championLevel;
                        mastery.points = body[i].championPoints;
                        mastery.name = self.getChampName(body[i].championId);
                        response.masteries.push(mastery);
                    }

                    request(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${pid}?api_key=${self.apikey}`, { json: true }, (err, res, body) => {
                        if (err) { return console.log(err); }
                        if(typeof body[0] !== "undefined") {
                            response.rank = typeof body[0].tier + " " + typeof body[0].rank
                        } else {
                            response.rank = "UNRANKED"
                        }

                        self.getMatchlist(aid, 1, (body) => {
                            var gameId = body.matches[0].gameId;

                            self.getMatchInfo(gameId, (body) => {
                                var participantId = self.getParticipantId(body, aid);
                                var participant = self.getParticipant(body, participantId);

                                response.match = {};

                                response.match.champ = self.getChampName(participant.championId);
                                response.match.win = participant.stats.win;
                                response.match.kills = participant.stats.kills;
                                response.match.deaths = participant.stats.deaths;
                                response.match.assists = participant.stats.assists;
                                response.match.cs = self.getCSPerMinutes(participant.stats, body.gameDuration);

                                console.log(response)
                                callback(response)
                
                            })
                        })
                    });
                });
                
            } else {
                response.error = true;
                response.error_desc = "user not found";
                callback(response);
            }
        });
    }

    comparePlayers(options, callback) {
        var user1 = options.user1;
        var user2 = options.user2;
        var self = this;
        this.getSummonerByName(user1, (summ1) => {
            self.getSummonerByName(user2, (summ2) => {
                if(typeof summ1.id !== 'undefined' && typeof summ2.id !== 'undefined') {
                    var aid1 = summ1.accountId;
                    var aid2 = summ2.accountId;

                    self.getClassicMatchlist(aid1, 5, (matchlist1) => {
                        self.getClassicMatchlist(aid2, 5, (matchlist2) => {

                            function getMatchlistScore(index, matchlist, score, aid, callback) {
                                if(index <= matchlist1.length - 1) {
                                    self.getMatchInfo(matchlist[index].gameId, (game) => {
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
                            const reducer = (accumulator, currentValue) => accumulator + currentValue;
                            getMatchlistScore(0, matchlist1, [0,0,0,0,0,0,0,0], aid1, (score1) => {
                                getMatchlistScore(0, matchlist2, [0,0,0,0,0,0,0,0], aid2, (score2) => {
                                    console.log(user1 + " : " + score1.reduce(reducer) + " - " + user2 + " : " + score2.reduce(reducer));
                                    
                                    callback({score1: score1, score2: score2});
                                });
                            });
                            
                            /*for (let i = 0; i < matchlist1.length; i++) {
                                const match = matchlist1[i];
                                score1 += self.getMatchScore(match);
                            }
                            
                            for (let i = 0; i < matchlist2.length; i++) {
                                const match = matchlist2[i];
                                score2 += self.getMatchScore(match);
                            }*/
                        })
                    })
                } else {
                    var response;
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

    getUserCS(options, callback) {
        var self = this;
        var username = options.username;
        var ngame = options.ngame;

        self.getSummonerByName(username, (summoner) => {
            if (typeof summoner.id !== 'undefined') {
                var aid1 = summoner.accountId;
                self.getClassicMatchlist(aid1, ngame, (matchlist1) => {

                    function getMathlistCS(index, matchlist, cs, aid, callback) {
                        if(index <= matchlist1.length - 1) {
                            self.getMatchInfo(matchlist[index].gameId, (game) => {

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

                    getMathlistCS(0, matchlist1, [], aid1, (cs1) => {
                        callback({cs: cs1});
                    });

                });
            }
        });
    }

    getChampName(champId) {
        for (const key in this.champJSON.data) {
            if(this.champJSON.data[key].key == champId) {
                return key;
            }
        }
        return "NOTACHAMP"
    }

    getSummonerByName(username, callback) {
        request(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}/?api_key=${this.apikey}`, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            callback(body);
        });
    }
    
    getMatchlist(accountId, endIndex, callback) {
        request(`https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?api_key=${this.apikey}&endIndex=${endIndex}`, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            callback(body);
        });
    }

    getClassicMatchlist(accountId, number, callback) {
        var matchlist = [];
        this.getMatchlist(accountId, number*5, (body) => {
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

    getMatchScore(match, accountId) {
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

    getMatchInfo(gameId, callback) {
        request(`https://euw1.api.riotgames.com/lol/match/v4/matches/${gameId}?api_key=${this.apikey}`, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            callback(body);
        });
    }

    getParticipantId(game, accountId) {
        for (let i = 0; i < game.participantIdentities.length; i++) {
            const element = game.participantIdentities[i];
            if(element.player.accountId === accountId) {
                return element.participantId;
            }
        }
    }

    getParticipant(game, participantId) {
        for (let i = 0; i < game.participants.length; i++) {
            const player = game.participants[i];
            if(player.participantId === participantId) {
                return player;
            }
        }
    }

    getTeam(game, participant) {
        for (let i = 0; i < game.teams.length; i++) {
            const element = game.teams[i];
            if(game.teams[i].teamId === participant.teamId) {
                return element;
            }
        }
    }

    getCSPerMinutes(stats, gameDuration) {
        return Math.round( (stats.totalMinionsKilled + stats.neutralMinionsKilledTeamJungle + stats.neutralMinionsKilledEnemyJungle) / (gameDuration / 60) * 10) / 10;
    }
}