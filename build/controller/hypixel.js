"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HypixelController = void 0;
var hypixel_1 = require("../views/hypixel");
var hypixel_2 = require("../models/hypixel");
/** Controller for Hypixel command */
var HypixelController = /** @class */ (function () {
    /**
     * @todo Instanciate model and view in constructor.
     * @param {string} api_key - Hypixel API key
     * @param {DiscordClient} client
     */
    function HypixelController(client, api_key) {
        this.model = new hypixel_2.HypixelModel(api_key);
        this.view = new hypixel_1.HypixelView(client.user);
    }
    /**
     * Process command with command arguments (in this case always do userStats only command)
     * @param {Array} args
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    HypixelController.prototype.command = function (args, lang, callback) {
        this.userStats(args[0], lang, callback);
    };
    /**
     * Ask the model to fetch statistics and send them to the view, then callback the message created in view
     * @param {string} username - Minecraft username
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    HypixelController.prototype.userStats = function (username, lang, callback) {
        var self = this;
        this.model.getUserStats({ username: username }, function (stats) {
            stats.username = username;
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
    return HypixelController;
}());
exports.HypixelController = HypixelController;
