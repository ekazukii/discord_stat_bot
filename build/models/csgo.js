"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSGOModel = void 0;
// @ts-ignore
var request = require("request");
var types_1 = require("../types");
/** Model for Counter Strike : Global Offensive command */
var CSGOModel = /** @class */ (function () {
    /**
     * save api_key
     * @param {string} api_key - Counter Strike : Global Offensive API key
     */
    function CSGOModel(api_key) {
        this.api_key = api_key;
    }
    /**
     * Fetch information about the user
     * @param {Object} options
     * @param {string} options.username - Faceit player's username
     * @param {function(Object)} callback  - Callback statistics to controller list of stats {@link CSGOView#showUserStats}
     */
    CSGOModel.prototype.getUserStats = function (options, callback) {
        var self = this;
        var username = options.username;
        var auth = {
            'bearer': this.api_key
        };
        request("https://open.faceit.com/data/v4/players?nickname=" + username, { json: true, auth: auth }, function (err, res, body) {
            if (err)
                throw err;
            if (typeof body.errors === "undefined") {
                var id = body.player_id;
                request("https://open.faceit.com/data/v4/players/" + id + "/stats/csgo", { json: true, auth: auth }, function (err, res, body2) {
                    if (typeof body2.errors === "undefined") {
                        var response = new types_1.CSGOStats;
                        response = {
                            elo: body.games.csgo.faceit_elo,
                            lvl: body.games.csgo.skill_level,
                            hs: body2.lifetime["Average Headshots %"],
                            win: body2.lifetime["Win Rate %"],
                            kd: body2.lifetime["Average K/D Ratio"]
                        };
                        callback(response);
                    }
                    else {
                        var errRes = new types_1.ErrorResponse;
                        errRes.error = true;
                        errRes.error_desc = "User don't play csgo";
                        callback(errRes);
                    }
                });
            }
            else {
                var errRes = new types_1.ErrorResponse;
                errRes.error = true;
                errRes.error_desc = "User not found";
                callback(errRes);
            }
        });
    };
    return CSGOModel;
}());
exports.CSGOModel = CSGOModel;
