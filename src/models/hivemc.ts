// @ts-ignore
import * as fetch from 'node-fetch';
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
        fetch('http://api.hivemc.com/v1/player/'+username+'/HIDE', {})
            .then((res: any) => res.json())
            .then((body1: any) => {
            if (typeof body1.code === 'undefined') {
                var response = new HivemcStats
                response.hide = body1.victories
                fetch('http://api.hivemc.com/v1/player/'+username+'/GRAV', {})
                    .then((res: any) => res.json())
                    .then((body2: any) => {
                        response.grav = body2.victories
                        fetch('http://api.hivemc.com/v1/player/'+username+'/BP', {})
                            .then((res: any) => res.json())
                            .then((body3: any) => {
                                response.blockparty = body3.victories
                                fetch('http://api.hivemc.com/v1/player/'+username+'/DR', {})
                                    .then((res: any) => res.json())
                                    .then((body4: any) => {
                                        response.deathrun = body4.victories
                                        callback(response);
                                    });
                            });
                    });
            } else {
                var errRes = new ErrorResponse;
                errRes.error = true;
                errRes.error_desc = "user not found";
                callback(errRes);
            }
        });
    }
}
