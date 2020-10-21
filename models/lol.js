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

                        self.getMatchlist(aid, (body) => {
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
                                response.match.cs = Math.round( (participant.stats.totalMinionsKilled + participant.stats.neutralMinionsKilledTeamJungle + participant.stats.neutralMinionsKilledEnemyJungle) / (body.gameDuration / 60) * 10) / 10;

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
    
    getMatchlist(accountId, callback) {
        request(`https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?api_key=${this.apikey}`, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            callback(body);
        });
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
}