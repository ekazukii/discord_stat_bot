"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoCController = void 0;
var coc_1 = require("../views/coc");
var coc_2 = require("../models/coc");
/** Controller for Clash of Clans command */
var CoCController = /** @class */ (function () {
    /**
     * @todo Instanciate model and view in constructor.
     * @param {string} api_key - Clash of Clans API key
     * @param {DiscordClient} client
     */
    function CoCController(client, api_key) {
        this.model = new coc_2.CoCModel(api_key);
        this.view = new coc_1.CoCView(client.user);
    }
    /**
     * Process command with command arguments (in this case always do userStats only command)
     * @param {Array} args
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    CoCController.prototype.command = function (args, lang, callback) {
        this.userStats(args[0], lang, callback);
    };
    /**
     * Ask the model to fetch statistics and send them to the view, then callback the message created in view
     * @param {string} tag - clash of Clans playerTag
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    CoCController.prototype.userStats = function (tag, lang, callback) {
        var self = this;
        this.model.getUserStats({ tag: tag }, function (stats) {
            stats.tag = tag;
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
    return CoCController;
}());
exports.CoCController = CoCController;
