// @ts-ignore
import * as request from "request";
import {ErrorResponse} from "../types";

/** Model of Mojang request */
export class MojangModel {
    constructor() {}

    /**
     * get trimmed UUID of player by his minecraft username
     * @param {Object} options
     * @param {string} options.username - Minecraft username of the player 
     * @param {function(string)} callback - Callback the UUID 
     */
    getUUIDByUsername(options: {username: string}, callback: Function) {
        var username = options.username
        request('https://api.mojang.com/users/profiles/minecraft/'+username, { json: true }, (err: Error, res: any, body: any) => {
            if (err) { return console.log(err); }
            if(typeof body !== "undefined" && typeof body.id !== "undefined") {
                var id = body.id.substr(0,8) + "-" + body.id.substr(8,4) + "-" + body.id.substr(12,4) + "-" + body.id.substr(16,4) + "-" + body.id.substr(20)
                callback(id);
            } else {
                var response = new ErrorResponse;
                response.error = true;
                response.error_desc = "user not found";
                callback(response);
            }
        });
    }
}
