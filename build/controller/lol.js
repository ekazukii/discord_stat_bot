"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoLController = void 0;
var lol_1 = require("../views/lol");
var lol_2 = require("../models/lol");
/** Controller of League of Legends commands */
var LoLController = /** @class */ (function () {
    /**
     *
     * @param {DiscordClient} client
     * @param {String} apikey - Riot api keys see {@link https://developer.riotgames.com/docs/portal#product-registration_application-process|riot appication process}
     */
    function LoLController(client, apikey) {
        this.client = client;
        this.model = new lol_2.LoLModel(apikey);
        this.view = new lol_1.LoLView(client.user);
    }
    /**
     * Process $lol command with command arguments ($lol profile, $lol vs, $lol cs, $lol rotation)
     * @param {Array} args - Commands arguments
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    LoLController.prototype.command = function (args, lang, callback) {
        switch (args[0]) {
            case "profile":
                this.userStats(args[1].replace(/\$/, " "), lang, callback);
                break;
            case "vs":
                this.comparePlayers(args[1].replace(/\$/, " "), args[2].replace(/\$/, " "), lang, callback);
                break;
            case "cs":
                this.userCS(args[1].replace(/\$/, " "), lang, callback);
                break;
            case "rotation":
                this.championRotation(lang, callback);
                break;
            default:
                break;
        }
    };
    /**
     * Compare two players by statistics of 5 last games, list of stats : {@link ScoreArray}
     * @param {string} user1 - First summoner's username
     * @param {string} user2 - Second summoner's username
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    LoLController.prototype.comparePlayers = function (user1, user2, lang, callback) {
        var self = this;
        this.model.comparePlayers({ user1: user1, user2: user2 }, function (stats) {
            stats.user1 = user1;
            stats.user2 = user2;
            if (stats.error) {
                self.view.printError(stats, lang, function (embed) {
                    callback(embed);
                });
            }
            else {
                self.view.showUsersComparation(stats, lang, function (embed) {
                    callback(embed);
                });
            }
        });
    };
    /**
     * Get, then show user statistics, list of stats : {@link LoLView#showUserStats}
     * @param {string} username - Summoner's username
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    LoLController.prototype.userStats = function (username, lang, callback) {
        var self = this;
        this.model.getUserStats({ username: username }, function (stats) {
            stats.username = username;
            if (stats.error) {
                self.view.printError(stats, lang, function (embed) {
                    // TODO : log
                    callback(embed);
                });
            }
            else {
                self.view.showUserStats(stats, lang, function (embed) {
                    // TODO : log
                    callback(embed);
                });
            }
        });
    };
    /**
     * Get, then show user creep score per minutes during last 5 games
     * @param {string} username - Summoner's username
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    LoLController.prototype.userCS = function (username, lang, callback) {
        var self = this;
        this.model.getUserCS({ username: username, ngame: 5 }, function (stats) {
            stats.username = username;
            if (stats.error) {
                self.view.printError(stats, lang, function (embed) {
                    // TODO : log
                    callback(embed);
                });
            }
            else {
                self.view.showUserCS(stats, lang, function (embed) {
                    callback(embed);
                });
            }
        });
    };
    /**
     * Get, then show user the current champion rotation
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    LoLController.prototype.championRotation = function (lang, callback) {
        var self = this;
        this.model.getChampionRotation(function (rotation) {
            if (rotation.error) {
                self.view.printError(rotation, lang, function (embed) {
                    // TODO : log
                    callback(embed);
                });
            }
            else {
                self.view.showChampionRotation(rotation, lang, function (embed) {
                    callback(embed);
                });
            }
        });
    };
    return LoLController;
}());
exports.LoLController = LoLController;
