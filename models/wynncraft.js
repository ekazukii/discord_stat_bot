"use strict";
const request = require('request');

/** Model for Wynncraft command */
class WynncraftModel {
    
    constructor() {}

    /**
     * Fetch statistics of the main character of the player
     * @param {Object} options
     * @param {string} options.username - Minecraft username of the player
     * @param {messageCallback} callback - Callback statistics, list of stats {@link WynncraftView#showUserStats}
     */
    getUserStats(options, callback) {
        var username = options.username;
        var classN = 0;
        var response = {}
        request('https://api.wynncraft.com/v2/player/'+username+'/stats', { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            if (body.code === 200) {
                var mainClass = body.data[0].classes[classN]
                response.username = body.data[0].username;
                response.className = mainClass.name;
                response.classLevel = mainClass.professions.combat.level;
                response.completedDungeons = mainClass.dungeons.completed;
                response.completedQuests = mainClass.quests.completed;
                response.mobsKilled = mainClass.mobsKilled;
                callback(response);
            } else {
                response.error = true
                response.error_desc = "user not found"
                callback(response);
            }
        });
    }
}

module.exports = WynncraftModel;
