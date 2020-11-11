"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSGOView = void 0;
var view_1 = require("./view");
/**
 * View of Counter Strike : Global Offensive command
 * @extends View
 */
var CSGOView = /** @class */ (function (_super) {
    __extends(CSGOView, _super);
    /**
     * @param {DiscordUser} bot - User property of bot instance
     */
    function CSGOView(bot) {
        return _super.call(this, bot) || this;
    }
    /**
     * Callback an {@link Embed} message with user statistics
     * @param {Object} stats
     * @param {sring} stats.username - Username of player
     * @param {number} stats.lvl - Faceit level of the player (1-10)
     * @param {number} stats.elo - Elo of the player
     * @param {number} stats.win - Percentage of winned game
     * @param {number} stats.hs - Percentage of headshot
     * @param {number} stats.kd - Kills/Deaths ration
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    CSGOView.prototype.showUserStats = function (stats, lang, callback) {
        var language = require("../../resources/lang/" + lang + ".json").csgo;
        var message = this.getEmbed();
        message.embed.title = language.statsTitle.replace("{arg1}", stats.username);
        message.embed.fields.push({
            name: language.lvlName,
            value: stats.lvl,
            inline: true
        }, {
            name: language.eloName,
            value: stats.elo,
            inline: true
        }, {
            name: language.winName,
            value: stats.win + " %",
            inline: true
        }, {
            name: language.hsName,
            value: stats.hs + " %",
            inline: true
        }, {
            name: language.kdName,
            value: stats.kd,
            inline: true
        });
        callback(message);
    };
    /**
     * Callback an {@link Embed} message with user not found error
     * @param {Object} err - Error information
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     * @todo Handle rate exceeded error
     */
    CSGOView.prototype.printError = function (err, lang, callback) {
        var language = require("../../resources/lang/" + lang + ".json").error;
        var message = this.getEmbedError();
        message.embed.title = language.errorTitle;
        if (err.error_desc === "User don't play csgo") {
            message.embed.fields.push({
                name: language.errorFieldName,
                value: language.errorFieldValueNotPlayingCSGO
            });
        }
        else {
            message.embed.fields.push({
                name: language.errorFieldName,
                value: language.errorFieldValue
            });
        }
        callback(message);
    };
    return CSGOView;
}(view_1.View));
exports.CSGOView = CSGOView;
