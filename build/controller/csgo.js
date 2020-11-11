"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSGOController = void 0;
var csgo_1 = require("../models/csgo");
var csgo_2 = require("../views/csgo");
/** Controller for Counter Strike : Global Offensive command */
var CSGOController = /** @class */ (function () {
    /**
     * @todo Instanciate model and view in constructor.
     * @param {string} api_key - Counter Strike : Global Offensive API key
     * @param {DiscordClient} client
     */
    function CSGOController(client, api_key) {
        this.model = new csgo_1.CSGOModel(api_key);
        this.view = new csgo_2.CSGOView(client.user);
    }
    /**
     * Process command with command arguments (in this case always do userStats only command)
     * @param {Array} args
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    CSGOController.prototype.command = function (args, lang, callback) {
        this.userStats(args[0], lang, callback);
    };
    /**
     * Ask the model to fetch statistics and send them to the view, then callback the message created in view
     * @param {string} username - Faceit username
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    CSGOController.prototype.userStats = function (username, lang, callback) {
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
    return CSGOController;
}());
exports.CSGOController = CSGOController;
