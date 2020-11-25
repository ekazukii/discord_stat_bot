import fetch from 'node-fetch';
import {ErrorResponse, HivemcStats} from "../types";

/** Model for Hivemc command */
export class HivemcModel {

    constructor() {}

    /**
     * Fetch numbers of wins (in hide&seek, gravity, blockparty and deathrun) of the player
     * @param {Object} options
     * @param {string} options.username - Minecraft username of the player
     * @param {function(Object)} callback  - Callback statistics to controller list of stats {@link HivemcView#showUserStats}
     * @todo Rebuild this method with maybe promises and make request async
     */
    getUserStats(options: {username: string}, callback: Function) {
        var username = options.username;
        var hide = fetch('http://api.hivemc.com/v1/player/'+username+'/HIDE', {});
        var grav = fetch('http://api.hivemc.com/v1/player/'+username+'/GRAV', {});
        var blockparty = fetch('http://api.hivemc.com/v1/player/'+username+'/BP', {});
        var deathrun = fetch('http://api.hivemc.com/v1/player/'+username+'/DR', {});

        Promise.all([hide, grav, blockparty, deathrun]).then(responses => {
            return Promise.all(responses.map(async res => {
                var game = res.url.split("/")[6];
                var json = await res.json();
                json.game = game;
                return json;
            }))
            
        }).then(json => {
            if(typeof json[0].victories === "undefined") {
                return Promise.reject(new Error("User not found"));
            } else {
                return Promise.all(json);
            }

        }).then(json => {
            var response = new HivemcStats;
            response.hide = json[0].victories
            response.grav = json[1].victories
            response.blockparty = json[2].victories
            response.deathrun = json[3].victories
            callback(response);

        }).catch((error: Error) => {
            var errRes = new ErrorResponse;
            errRes.error = true;
            errRes.error_desc = "user not found";
            callback(errRes);
        })
    }
}
