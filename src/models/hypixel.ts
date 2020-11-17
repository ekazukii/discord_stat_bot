import fetch from 'node-fetch';
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
                        
                        // Check number of wins in SkyWars BuildBattler, UHC and SpeedUHC
                        for (let i = 0; i < games.length; i++) {
                            if(typeof body.player.stats[games[i]] !== "undefined") {
                                response.wins.push(body.player.stats[games[i]].wins || 0);
                            } else {
                                response.wins.push(0)
                            }
                        }

                        // Check amount of victories in Bedwars
                        if(typeof body.player.stats["Bedwars"] !== "undefined") {
                            response.wins.push(body.player.stats["Bedwars"].wins_bedwars || 0);
                        } else {
                            response.wins.push(0)
                        }

                        // Check if player bought a rank
                        if(typeof body.player.newPackageRank !== "undefined") {
                            response.rank = body.player.newPackageRank;
                        }

                        // Calculate Hypixel level with amount of xp
                        response.plevel = Math.round((Math.sqrt((2 * body.player.networkExp) + 30625) / 50) - 2.5);

                        var promises = []

                        // Get current status of the player
                        promises.push(new Promise((resolve, reject) => {
                            fetch(`https://api.hypixel.net/status?uuid=${uuid}&key=${self.api_key}`, {})
                                .then((res: any) => res.json())
                                .then((body: any) => {
                                    resolve(body.session.online);
                                })
                        }));

                        
                        // Get guild name of player
                        promises.push(new Promise((resolve, reject) => {
                            fetch(`https://api.hypixel.net/findGuild?byUuid=${uuid}&key=${self.api_key}`, {})
                                    .then((res: any) => res.json())
                                    .then((body: any) => {
                                        if(typeof body.guild !== "undefined" && body.guild !== null) {
                                            fetch(`https://api.hypixel.net/guild?id=${body.guild}&key=${self.api_key}`, {})
                                                .then((res: any) => res.json())
                                                .then((body1: any) => {
                                                    resolve(body1.guild.name);
                                            });
                                        } else {
                                            resolve();
                                        }
                                    });
                        }));

                        Promise.all(promises).then((values: any) => {
                            response.online = values[0];
                            response.guild = values[1];

                            callback(response);
                        });
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