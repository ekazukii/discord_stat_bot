// @ts-ignore
import * as fetch from 'node-fetch';
import {ErrorResponse, HypyxelStats} from "../types";
import {MojangModel} from "./mojang";

/** 
 * Model for Hypixel command 
 * @export
 * @class 
 */
class HypixelModel {

    api_key: string;
    mojang: MojangModel;

    /**
     * Instantiate the Mojang model (usernameToUUID) and save api_key
     * @param {string} api_key - Hypixel API key
     * @constructor
     * @method
     * @public
     */
    constructor(api_key: string) {
        this.api_key = api_key;
        this.mojang = new MojangModel();
    }


    /**
     * Fetch information about the user
     * @param {Object} options
     * @param {string} options.username - Minecraft username of the player
     * @param {function(Object)} callback  - Callback statistics to controller list of stats {@link HypixelView#showUserStats}
     */
    getUserStats(options: {username: string}, callback: Function) {
        var self = this;
        this.mojang.getUUIDByUsername(options.username, (uuid: string) => {
            fetch(`https://api.hypixel.net/player?uuid=${uuid}&key=${self.api_key}`, {})
                .then((res: any) => res.json())
                .then((body: any) => {
                    if(typeof body.player !== "undefined" && body.player !== null) {
                        var response = new HypyxelStats;
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
                        fetch(`https://api.hypixel.net/status?uuid=${uuid}&key=${self.api_key}`, {})
                            .then((res: any) => res.json())
                            .then((body1: any) => {
                            response.online = body1.session.online;
                                fetch(`https://api.hypixel.net/findGuild?byUuid=${uuid}&key=${self.api_key}`, {})
                                    .then((res: any) => res.json())
                                    .then((body2: any) => {
                                        if(typeof body2.guild !== "undefined" && body2.guild !== null) {
                                            console.log(body2.guild)
                                            fetch(`https://api.hypixel.net/guild?id=${body2.guild}&key=${self.api_key}`, {})
                                                .then((res: any) => res.json())
                                                .then((body3: any) => {
                                                    response.guild = body3.guild.name;
                                                    callback(response);
                                            });
                                        } else {
                                            callback(response)
                                        }
                                    });
                            })
                    } else {
                        var errRes = new ErrorResponse;
                        errRes.error = true;
                        errRes.error_desc = "user not found";
                        callback(errRes);
                    }
                });
        });
    }
}

export {HypixelModel};