"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OWController = void 0;
var ow_1 = require("../views/ow");
var ow_2 = require("../models/ow");
/** Controller for Overwatch command */
var OWController = /** @class */ (function () {
    /**
     * @todo Instanciate model and view in constructor.
     * @param {DiscordClient} client
     */
    function OWController(client) {
        this.model = new ow_2.OWModel();
        this.view = new ow_1.OWView(client.user);
    }
    /**
     * Process command with command arguments
     * @param {Array} args
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    OWController.prototype.command = function (args, lang, callback) {
        if (args[0] === "search") {
            this.searchUser(args, lang, callback);
        }
        else if (args[0] === "profile") {
            this.userStats(args, lang, callback);
        }
    };
    /**
     * Ask the model to search user with specific username and send them to the view, then callback the message created in view
     * @param {array} args - Commands arguments
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    OWController.prototype.searchUser = function (args, lang, callback) {
        var _this = this;
        this.model.searchPublicUsers({ username: args[1] }, function (stats) {
            stats.username = args[1];
            if (stats.users.length > 0) {
                _this.view.showSearch(stats, lang, function (embed) {
                    callback(embed);
                });
            }
            else {
                stats.error = true;
                stats.error_desc = "User not found";
                _this.view.printError(stats, lang, function (embed) {
                    callback(embed);
                });
            }
        });
    };
    /**
     * Ask the model to fetch statistics and send them to the view, then callback the message created in view
     * @param {string} args - Commands arguments
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    OWController.prototype.userStats = function (args, lang, callback) {
        var self = this;
        this.model.getUserStats({ username: args[1], platform: args[2] }, function (stats) {
            if (stats.error) {
                self.view.printError(stats, lang, function (embed) {
                    callback(embed);
                });
            }
            else {
                self.view.showUserStats(stats, lang, function (embed) {
                    callback(embed);
                });
            }
        });
    };
    return OWController;
}());
exports.OWController = OWController;
