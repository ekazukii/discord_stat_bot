"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WynncraftController = void 0;
var wynncraft_1 = require("../views/wynncraft");
var wynncraft_2 = require("../models/wynncraft");
/** Controller for Wynncraft command */
var WynncraftController = /** @class */ (function () {
    /**
     * @todo Instanciate model and view in constructor.
     * @param {DiscordClient} client
     */
    function WynncraftController(client) {
        this.client = client;
    }
    /**
     * Process command with command arguments (in this case always do userStats only one command)
     * @param {Array<string>} args
     * @param  {Channel} channel [Channel]{@link https://discord.js.org/#/docs/main/stable/class/Channel} where the command was executed
     * @param {messageCallback} callback
     */
    WynncraftController.prototype.command = function (args, lang, callback) {
        this.userStats(args[0], lang, callback);
    };
    /**
     * Ask the model to fetch statistics and send them to the view, then callback the message created in view
     * @param {string} username - Minecraft username
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    WynncraftController.prototype.userStats = function (username, lang, callback) {
        var client = this.client;
        var model = new wynncraft_2.WynncraftModel();
        var view = new wynncraft_1.WynncraftView(client.user);
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
    return WynncraftController;
}());
exports.WynncraftController = WynncraftController;
