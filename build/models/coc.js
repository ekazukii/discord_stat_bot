"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoCModel = void 0;
// @ts-ignore
var request = require("request");
var types_1 = require("../types");
/** Model for Clash of Clans command */
var CoCModel = /** @class */ (function () {
    /**
     * save api_key
     * @param {string} api_key - Clash of Clans API key
     */
    function CoCModel(api_key) {
        this.api_key = api_key;
    }
    /**
     * Fetch information about the user
     * @param {Object} options
     * @param {string} options.tag - Clash of Clans player's tag
     * @param {function(Object)} callback  - Callback statistics to controller list of stats {@link CoCView#showUserStats}
     */
    CoCModel.prototype.getUserStats = function (options, callback) {
        var self = this;
        var tag = options.tag;
        var uriTag = tag.replace("#", "%23");
        var auth = {
            'bearer': this.api_key
        };
        request("https://api.clashofclans.com/v1/players/" + uriTag, { json: true, auth: auth }, function (err, res, body) {
            if (err)
                throw err;
            if (body.reason === "notFound") {
                var errRes = new types_1.ErrorResponse;
                errRes.error = true;
                errRes.error_desc = "User not found";
                callback(errRes);
            }
            else if (body.reason === "accessDenied.invalidIp") {
                var errRes = new types_1.ErrorResponse;
                errRes.error = true;
                errRes.error_desc = "invalid ip";
                callback(errRes);
            }
            else {
                var response = new types_1.CoCStats;
                response.name = body.name;
                response.townHallLevel = body.townHallLevel;
                response.trophies = body.trophies;
                if (typeof body.clan !== "undefined") {
                    response.clan = {
                        name: body.clan.name,
                        tag: body.clan.tag
                    };
                }
                response.level = body.expLevel;
                response.heroes = body.heroes;
                callback(response);
            }
        });
    };
    return CoCModel;
}());
exports.CoCModel = CoCModel;
