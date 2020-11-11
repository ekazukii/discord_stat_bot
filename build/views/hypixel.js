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
exports.HypixelView = void 0;
var view_1 = require("./view");
/**
 * View of Hypixel command
 * @extends View
 */
var HypixelView = /** @class */ (function (_super) {
    __extends(HypixelView, _super);
    /**
     * @param {DiscordUser} bot - User property of bot instance
     */
    function HypixelView(bot) {
        return _super.call(this, bot) || this;
    }
    /**
     * Callback an {@link Embed} message with user statistics
     * @param {HypyxelStats} stats
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    HypixelView.prototype.showUserStats = function (stats, lang, callback) {
        console.log(stats);
        var language = require("../../resources/lang/" + lang + ".json").hypixel;
        var message = this.getEmbed();
        message.embed.title = language.statsTitle.replace("{arg1}", stats.username);
        var valueString = "";
        for (var i = 0; i < stats.wins.length; i++) {
            valueString += stats.wins[i] + "\r";
        }
        var guildString, rankString, statusString;
        if (typeof stats.guild !== "undefined") {
            guildString = stats.guild;
        }
        else {
            guildString = language.noGuild;
        }
        if (typeof stats.rank !== "undefined") {
            rankString = stats.rank;
        }
        else {
            rankString = language.noRank;
        }
        if (stats.status) {
            statusString = language.statusOnline;
        }
        else {
            statusString = language.statusOffline;
        }
        message.embed.fields.push({
            name: language.guildTitle,
            value: guildString,
            inline: true
        }, {
            name: language.rankTitle,
            value: rankString,
            inline: true
        }, {
            name: "Level",
            value: stats.plevel,
            inline: true
        }, {
            name: language.listGamesName,
            value: language.listGamesValue,
            inline: true
        }, {
            name: language.numberVictories,
            value: valueString,
            inline: true
        }, {
            name: language.statusTitle,
            value: statusString
        });
        callback(message);
    };
    /**
     * Callback an {@link Embed} message with user not found error
     * @param {ErrorResponse} err - Error information
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     * @todo Handle rate exceeded error
     */
    HypixelView.prototype.printError = function (err, lang, callback) {
        var language = require("../../resources/lang/" + lang + ".json").error;
        var message = this.getEmbedError();
        message.embed.title = language.errorTitle;
        message.embed.fields.push({
            name: language.errorFieldName,
            value: language.errorFieldValue
        });
        callback(message);
    };
    return HypixelView;
}(view_1.View));
exports.HypixelView = HypixelView;
