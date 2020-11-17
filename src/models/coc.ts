import fetch from 'node-fetch';
import {ErrorResponse, CoCStats} from "../types";

/** Model for Clash of Clans command */
export class CoCModel {
    api_key: string;
    /**
     * save api_key
     * @param {string} api_key - Clash of Clans API key
     */
    constructor(api_key: string) {
        this.api_key = api_key;
    }

    /**
     * Fetch information about the user
     * @param {Object} options
     * @param {string} options.tag - Clash of Clans player's tag
     * @param {function(Object)} callback  - Callback statistics to controller list of stats {@link CoCView#showUserStats}
     */
    getUserStats(options: {tag: string}, callback: Function) {
        var self = this;
        var tag = options.tag;
        var uriTag = tag.replace("#", "%23");
        var headers = {
            Authorization: "Bearer " + this.api_key
        }

        fetch(`https://api.clashofclans.com/v1/players/${uriTag}`, {headers: headers})
            .then((res: any) => res.json())
            .then((body: any) => {  
                if(body.reason === "notFound") {
                    var errRes = new ErrorResponse;
                    errRes.error = true;
                    errRes.error_desc = "User not found";
                    callback(errRes);
                } else if(body.reason === "accessDenied.invalidIp") {
                    var errRes = new ErrorResponse;
                    errRes.error = true;
                    errRes.error_desc = "invalid ip";
                    callback(errRes);
                } else {
                    var response = new CoCStats;
                    response.name = body.name
                    response.townHallLevel = body.townHallLevel;
                    response.trophies = body.trophies;
                    if(typeof body.clan !== "undefined") {
                        response.clan = {
                            name: body.clan.name,
                            tag: body.clan.tag
                        }
                    }
                    response.level = body.expLevel;
                    response.heroes = body.heroes;
                    callback(response);
                }
            });
    }
}
