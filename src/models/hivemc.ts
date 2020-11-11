// @ts-ignore
import * as request from "request";
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
        request('http://api.hivemc.com/v1/player/'+username+'/HIDE', { json: true }, (err1: Error, res1: any, body1: any) => {
            if (err1) { return console.log(err1); }
            if (typeof body1.code === 'undefined') {
                var response = new HivemcStats
                response.hide = res1.body.victories
                request('http://api.hivemc.com/v1/player/'+username+'/GRAV', { json: true }, (err2: Error, _res2: any, body2: any) => {
                    if (err2) { return console.log(err2); }
                    response.grav = body2.victories
                    request('http://api.hivemc.com/v1/player/'+username+'/BP', { json: true }, (err3: Error, _res3: any, body3: any) => {
                        if (err3) { return console.log(err3); }
                        response.blockparty = body3.victories
                        request('http://api.hivemc.com/v1/player/'+username+'/DR', { json: true }, (err4: Error, _res4: any, body4: any) => {
                            if (err4) { return console.log(err4); }
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
