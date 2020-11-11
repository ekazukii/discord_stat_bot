"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MojangModel = void 0;
// @ts-ignore
var request = require("request");
var types_1 = require("../types");
/** Model of Mojang request */
var MojangModel = /** @class */ (function () {
    function MojangModel() {
    }
    /**
     * get trimmed UUID of player by his minecraft username
     * @param {Object} options
     * @param {string} options.username - Minecraft username of the player
     * @param {function(string)} callback - Callback the UUID
     */
    MojangModel.prototype.getUUIDByUsername = function (options, callback) {
        var username = options.username;
        request('https://api.mojang.com/users/profiles/minecraft/' + username, { json: true }, function (err, res, body) {
            if (err) {
                return console.log(err);
            }
            if (typeof body !== "undefined" && typeof body.id !== "undefined") {
                var id = body.id.substr(0, 8) + "-" + body.id.substr(8, 4) + "-" + body.id.substr(12, 4) + "-" + body.id.substr(16, 4) + "-" + body.id.substr(20);
                callback(id);
            }
            else {
                var response = new types_1.ErrorResponse;
                response.error = true;
                response.error_desc = "user not found";
                callback(response);
            }
        });
    };
    return MojangModel;
}());
exports.MojangModel = MojangModel;
