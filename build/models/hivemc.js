"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HivemcModel = void 0;
// @ts-ignore
var request = require("request");
var types_1 = require("../types");
/** Model for Hivemc command */
var HivemcModel = /** @class */ (function () {
    function HivemcModel() {
    }
    /**
     * Fetch numbers of wins (in hide&seek, gravity, blockparty and deathrun) of the player
     * @param {Object} options
     * @param {string} options.username - Minecraft username of the player
     * @param {function(Object)} callback  - Callback statistics to controller list of stats {@link HivemcView#showUserStats}
     * @todo Rebuild this method with maybe promises and make request async
     */
    HivemcModel.prototype.getUserStats = function (options, callback) {
        var username = options.username;
        request('http://api.hivemc.com/v1/player/' + username + '/HIDE', { json: true }, function (err1, res1, body1) {
            if (err1) {
                return console.log(err1);
            }
            if (typeof body1.code === 'undefined') {
                var response = new types_1.HivemcStats;
                response.hide = res1.body.victories;
                request('http://api.hivemc.com/v1/player/' + username + '/GRAV', { json: true }, function (err2, _res2, body2) {
                    if (err2) {
                        return console.log(err2);
                    }
                    response.grav = body2.victories;
                    request('http://api.hivemc.com/v1/player/' + username + '/BP', { json: true }, function (err3, _res3, body3) {
                        if (err3) {
                            return console.log(err3);
                        }
                        response.blockparty = body3.victories;
                        request('http://api.hivemc.com/v1/player/' + username + '/DR', { json: true }, function (err4, _res4, body4) {
                            if (err4) {
                                return console.log(err4);
                            }
                            response.deathrun = body4.victories;
                            callback(response);
                        });
                    });
                });
            }
            else {
                var errRes = new types_1.ErrorResponse;
                errRes.error = true;
                errRes.error_desc = "user not found";
                callback(errRes);
            }
        });
    };
    return HivemcModel;
}());
exports.HivemcModel = HivemcModel;
