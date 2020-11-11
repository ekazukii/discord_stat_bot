"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HivemcController = void 0;
var hivemc_1 = require("../views/hivemc");
var hivemc_2 = require("../models/hivemc");
/** Controller for hivemc command */
var HivemcController = /** @class */ (function () {
    /**
     * @todo Instanciate model and view in constructor.
     * @param {DiscordClient} client
     */
    function HivemcController(client) {
        this.client = client;
    }
    /**
     * Process command with command arguments (in this case always do userStats only command)
     * @param {Array} args
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    HivemcController.prototype.command = function (args, lang, callback) {
        this.userStats(args[0], lang, callback);
    };
    /**
     * Ask the model to fetch statistics and send them to the view, then callback the message created in view
     * @param {string} username - Minecraft username
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    HivemcController.prototype.userStats = function (username, lang, callback) {
        var client = this.client;
        var model = new hivemc_2.HivemcModel();
        var view = new hivemc_1.HivemcView(client.user);
        model.getUserStats({ username: username }, function (stats) {
            stats.username = username;
            if (stats.error) {
                view.printError(stats, lang, function (embed) {
                    callback(embed);
                });
            }
            else {
                view.showUserStats(stats, lang, function (embed) {
                    callback(embed);
                });
            }
        });
    };
    return HivemcController;
}());
exports.HivemcController = HivemcController;
