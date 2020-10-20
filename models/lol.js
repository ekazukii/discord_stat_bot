const request = require('request');

module.exports = class LoLModel {
    constructor(apikey) {
        this.apikey = apikey;
    }

    getUserStats(options, callback) {
        var self = this;
        var username = options.username;
        var response = {}
        request(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}/?api_key=${self.apikey}`, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            if (typeof body.id !== 'undefined') {
                var pid = res.body.id;
                var aid = res.body.accountId;
                response.level = res.body.summonerLevel;
                response.masteries = [];
                request(`https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${pid}/?api_key=${self.apikey}`, { json: true }, (err, res, body) => {
                    request("http://ddragon.leagueoflegends.com/cdn/10.20.1/data/en_US/champion.json", { json: true }, (err2, res2, body2) => {
                        for (let i = 0; i < 3; i++) {
                            var mastery = {}
                            mastery.level = body[i].championLevel;
                            mastery.points = body[i].championPoints;

                            for (const key in body2.data) {
                                if(body2.data[key].key == body[i].championId) {
                                    mastery.name = key;
                                }
                            }
                            response.masteries.push(mastery);
                        }

                        request(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${pid}?api_key=${self.apikey}`, { json: true }, (err, res, body) => {
                            if (err) { return console.log(err); }
                            if(typeof body[0] !== "undefined") {
                                response.rank = typeof body[0].tier + " " + typeof body[0].rank
                            } else {
                                response.rank = "UNRANKED"
                            }

                            request(`https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${aid}?api_key=${self.apikey}`, { json: true }, (err, res, body) => {
                                if (err) { return console.log(err); }
                                var gameId = body.matches[0].gameId;

                                request(`https://euw1.api.riotgames.com/lol/match/v4/matches/${gameId}?api_key=${self.apikey}`, { json: true }, (err, res, body) => {
                                    if (err) { return console.log(err); }
                                    for (let i = 0; i < body.participantIdentities.length; i++) {
                                        console.log("pid")
                                        const element = body.participantIdentities[i];
                                        if(element.player.accountId === aid) {
                                            console.log("pid found")
                                            var participantId = element.participantId;
                                            for (let j = 0; j < body.participants.length; j++) {
                                                const player = body.participants[j];
                                                if(player.participantId === participantId) {
                                                    console.log("participant id found")
                                                    response.match = {};

                                                    for (const key in body2.data) {
                                                        if(body2.data[key].key == body.participants[j].championId) {
                                                            response.match.champ = key;
                                                        }
                                                    }
                                                    
                                                    response.match.win = body.participants[j].stats.win;
                                                    response.match.kills = body.participants[j].stats.kills;
                                                    response.match.deaths = body.participants[j].stats.deaths;
                                                    response.match.assists = body.participants[j].stats.assists;
                                                    response.match.cs = Math.round( (body.participants[j].stats.totalMinionsKilled + body.participants[j].stats.neutralMinionsKilledTeamJungle + body.participants[j].stats.neutralMinionsKilledEnemyJungle) / (body.gameDuration / 60) * 10) / 10;

                                                    console.log(response)
                                                    callback(response)
                                                }
                                            }
                                        }
                                    }
                                    
                                })
                            })
                        });
                    });
                });
                
            } else {
                response.error = true;
                response.error_desc = "user not found";
                callback(response);
            }
        });
    }
}
