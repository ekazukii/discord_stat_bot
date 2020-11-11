"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HypixelModel = void 0;
// @ts-ignore
var request = require("request");
var types_1 = require("../types");
var mojang_1 = require("./mojang");
/**
 * Model for Hypixel command
 * @export
 * @class
 */
var HypixelModel = /** @class */ (function () {
    /**
     * Instantiate the Mojang model (usernameToUUID) and save api_key
     * @param {string} api_key - Hypixel API key
     * @constructor
     * @method
     * @public
     */
    function HypixelModel(api_key) {
        this.api_key = api_key;
        this.mojang = new mojang_1.MojangModel();
    }
    /**
     * Fetch information about the user
     * @param {Object} options
     * @param {string} options.username - Minecraft username of the player
     * @param {function(Object)} callback  - Callback statistics to controller list of stats {@link HypixelView#showUserStats}
     */
    HypixelModel.prototype.getUserStats = function (options, callback) {
        var self = this;
        this.mojang.getUUIDByUsername(options, function (uuid) {
            request("https://api.hypixel.net/player?uuid=" + uuid + "&key=" + self.api_key, { json: true }, function (err, res, body) {
                if (err)
                    throw err;
                if (typeof body.player !== "undefined" && body.player !== null) {
                    var response = new types_1.HypyxelStats;
                    var games = ["SkyWars", "BuildBattle", "UHC", "SpeedUHC"];
                    response.wins = [];
                    for (var i = 0; i < games.length; i++) {
                        if (typeof body.player.stats[games[i]] !== "undefined") {
                            if (typeof body.player.stats[games[i]].wins !== "undefined") {
                                response.wins.push(body.player.stats[games[i]].wins);
                            }
                            else {
                                response.wins.push(0);
                            }
                        }
                        else {
                            response.wins.push(0);
                        }
                    }
                    if (typeof body.player.stats["Bedwars"] !== "undefined") {
                        if (typeof body.player.stats["Bedwars"].wins_bedwars !== "undefined") {
                            response.wins.push(body.player.stats["Bedwars"].wins_bedwars);
                        }
                        else {
                            response.wins.push(0);
                        }
                    }
                    else {
                        response.wins.push(0);
                    }
                    if (typeof body.player.newPackageRank !== "undefined") {
                        response.rank = body.player.newPackageRank;
                    }
                    response.plevel = Math.round((Math.sqrt((2 * body.player.networkExp) + 30625) / 50) - 2.5);
                    request("https://api.hypixel.net/status?uuid=" + uuid + "&key=" + self.api_key, { json: true }, function (err, res, body1) {
                        response.online = body1.session.online;
                        request("https://api.hypixel.net/findGuild?byUuid=" + uuid + "&key=" + self.api_key, { json: true }, function (err, res, body2) {
                            if (typeof body2.guild !== "undefined" && body2.guild !== null) {
                                console.log(body2.guild);
                                request("https://api.hypixel.net/guild?id=" + body2.guild + "&key=" + self.api_key, { json: true }, function (err, res, body3) {
                                    response.guild = body3.guild.name;
                                    callback(response);
                                });
                            }
                            else {
                                callback(response);
                            }
                        });
                    });
                }
                else {
                    var errRes = new types_1.ErrorResponse;
                    errRes.error = true;
                    errRes.error_desc = "user not found";
                    callback(errRes);
                }
            });
        });
    };
    return HypixelModel;
}());
exports.HypixelModel = HypixelModel;
