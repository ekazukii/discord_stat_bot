const request = require('request');
const Mojang = require("./mojang.js");

/** Model for Hypixel command */
class HypixelModel {

    constructor(api_key) {
        this.api_key = api_key;
        this.mojang = new Mojang();
    }


    /**
     * Fetch numbers of wins (FILL THIS) of the player
     * @param {Object} options
     * @param {string} options.username - Minecraft username of the player
     * @param {function(Object)} callback  - Callback statistics to controller list of stats {@link HivemcView#showUserStats}
     */
    getUserStats(options, callback) {
        var response = {}
        var self = this;
        this.mojang.getUUIDByUsername(options, (uuid) => {
            var response = {};
            request(`https://api.hypixel.net/player?uuid=${uuid}&key=${self.api_key}`, { json: true }, (err, res, body) => {
                if(err) throw err;
                if(typeof body.player !== "undefined" && body.player !== null) {
                    var games = ["SkyWars", "BuildBattle", "UHC", "SpeedUHC"];
                    response.wins = []
                    for (let i = 0; i < games.length; i++) {
                        if(typeof body.player.stats[games[i]] !== "undefined") {
                            if(typeof body.player.stats[games[i]].wins !== "undefined") {
                                response.wins.push(body.player.stats[games[i]].wins);
                            } else {
                                response.wins.push(0)
                            }
                        } else {
                            response.wins.push(0)
                        }
                    }

                    if(typeof body.player.stats["Bedwars"] !== "undefined") {
                        if(typeof body.player.stats["Bedwars"].wins_bedwars !== "undefined") {
                            response.wins.push(body.player.stats["Bedwars"].wins_bedwars);
                        } else {
                            response.wins.push(0)
                        }
                    } else {
                        response.wins.push(0)
                    }

                    if(typeof body.player.newPackageRank !== "undefined") {
                        response.rank = body.player.newPackageRank;
                    }

                    response.plevel = Math.round((Math.sqrt((2 * body.player.networkExp) + 30625) / 50) - 2.5);
                    request(`https://api.hypixel.net/status?uuid=${uuid}&key=${self.api_key}`, { json: true }, (err, res, body1) => {
                        response.online = body1.session.online;
                        request(`https://api.hypixel.net/findGuild?byUuid=${uuid}&key=${self.api_key}`, { json: true }, (err, res, body2) => {
                            if(typeof body2.guild !== "undefined" && body2.guild !== null) {
                                console.log(body2.guild)
                                request(`https://api.hypixel.net/guild?id=${body2.guild}&key=${self.api_key}`, { json: true }, (err, res, body3) => {
                                    response.guild = body3.guild.name;
                                    callback(response);
                                });
                            } else {
                                callback(response)
                            }
                        });
                    })
                } else {
                    response.error = true;
                    response.error_desc = "user not found";
                    callback(response);
                }
            });
        });
    }
}

module.exports = HypixelModel;
