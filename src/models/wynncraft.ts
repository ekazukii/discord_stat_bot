// @ts-ignore
import * as fetch from 'node-fetch';
import {ErrorResponse, WynncraftStats} from "../types";

/** Model for Wynncraft command */
export class WynncraftModel {
    
    constructor() {}

    /**
     * Fetch statistics of the main character of the player
     * @param {Object} options
     * @param {string} options.username - Minecraft username of the player
     * @param {function(Object)} callback  - Callback statistics to controller, list of stats {@link WynncraftView#showUserStats}
     */
    getUserStats(options: {username: string}, callback: Function) {
        var username = options.username;
        var classN = 0;
        fetch('https://api.wynncraft.com/v2/player/'+username+'/stats', {})
            .then((res: any) => res.json())
            .then((body: any) => {
                if (body.code === 200) {
                    var response = new WynncraftStats;
                    var mainClass = body.data[0].classes[classN]
                    response.username = body.data[0].username;
                    response.className = mainClass.name;
                    response.classLevel = mainClass.professions.combat.level;
                    response.completedDungeons = mainClass.dungeons.completed;
                    response.completedQuests = mainClass.quests.completed;
                    response.mobsKilled = mainClass.mobsKilled;
                    callback(response);
                } else {
                    var errRes = new ErrorResponse;
                    errRes.error = true
                    errRes.error_desc = "user not found"
                    callback(errRes);
                }
            });
    }
}
