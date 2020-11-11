"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WynncraftModel = void 0;
// @ts-ignore
var request = require("request");
var types_1 = require("../types");
/** Model for Wynncraft command */
var WynncraftModel = /** @class */ (function () {
    function WynncraftModel() {
    }
    /**
     * Fetch statistics of the main character of the player
     * @param {Object} options
     * @param {string} options.username - Minecraft username of the player
     * @param {function(Object)} callback  - Callback statistics to controller, list of stats {@link WynncraftView#showUserStats}
     */
    WynncraftModel.prototype.getUserStats = function (options, callback) {
        var username = options.username;
        var classN = 0;
        request('https://api.wynncraft.com/v2/player/' + username + '/stats', { json: true }, function (err, res, body) {
            if (err) {
                return console.log(err);
            }
            if (body.code === 200) {
                var response = new types_1.WynncraftStats;
                var mainClass = body.data[0].classes[classN];
                response.username = body.data[0].username;
                response.className = mainClass.name;
                response.classLevel = mainClass.professions.combat.level;
                response.completedDungeons = mainClass.dungeons.completed;
                response.completedQuests = mainClass.quests.completed;
                response.mobsKilled = mainClass.mobsKilled;
                callback(response);
            }
            else {
                var errRes = new types_1.ErrorResponse;
                errRes.error = true;
                errRes.error_desc = "user not found";
                callback(errRes);
            }
        });
    };
    return WynncraftModel;
}());
exports.WynncraftModel = WynncraftModel;
