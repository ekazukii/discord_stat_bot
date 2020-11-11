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
exports.OWView = void 0;
var view_1 = require("./view");
/**
 * View of Overwatch command
 * @extends View
 */
var OWView = /** @class */ (function (_super) {
    __extends(OWView, _super);
    /**
     * @param {DiscordUser} bot - User property of bot instance
     */
    function OWView(bot) {
        return _super.call(this, bot) || this;
    }
    /**
     * Callback an {@link Embed} message with user statistics
     * @param {OWStats} stats
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    OWView.prototype.showUserStats = function (stats, lang, callback) {
        var language = require("../../resources/lang/" + lang + ".json").ow;
        var message = this.getEmbed();
        message.embed.title = language.statsTitle.replace("{arg1}", stats.username);
        message.embed.fields.push({
            name: language.gamesPlayedName,
            value: stats.gamesPlayed,
            inline: true
        }, {
            name: language.winrateName,
            value: stats.winrate,
            inline: true
        }, {
            name: language.hoursName,
            value: stats.hours,
            inline: true
        });
        if (stats.heroes.length > 0) {
            var heroNameString = "", heroHourString = "";
            for (var i = 0; i < stats.heroes.length; i++) {
                heroNameString += stats.heroes[i].name + "\r";
                heroHourString += stats.heroes[i].hours + "\r";
            }
            message.embed.fields.push({
                name: language.topName,
                value: "1\r2\r3",
                inline: true
            }, {
                name: language.heroName,
                value: heroNameString,
                inline: true
            }, {
                name: language.heroHours,
                value: heroHourString,
                inline: true
            });
        }
        if (stats.ranks.length > 0) {
            var srString = "", rankNameString = "", roleString = "";
            for (var i = 0; i < stats.ranks.length; i++) {
                srString += stats.ranks[i].sr + "\r";
                rankNameString += stats.ranks[i].rankName + "\r";
                roleString += stats.ranks[i].role + "\r";
            }
            message.embed.fields.push({
                name: language.skillRatingName,
                value: srString,
                inline: true
            }, {
                name: language.rankName,
                value: rankNameString,
                inline: true
            }, {
                name: language.rankRoleName,
                value: roleString,
                inline: true
            });
        }
        callback(message);
    };
    /**
     * Callback an {@link Embed} message with users founded
     * @param {OWSearch} stats
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    OWView.prototype.showSearch = function (stats, lang, callback) {
        var language = require("../../resources/lang/" + lang + ".json").ow;
        var message = this.getEmbed();
        message.embed.title = language.searchTitle.replace("{arg1}", stats.username);
        var idString = "", levelString = "", platformString = "";
        for (var i = 0; i < stats.users.length; i++) {
            idString += stats.users[i].urlName + "\r";
            levelString += stats.users[i].playerLevel + "\r";
            platformString += stats.users[i].platform + "\r";
        }
        if (stats.more) {
            idString += "......................\r";
            levelString += ".......\r";
            platformString += "......\r";
        }
        message.embed.fields.push({
            name: language.idName,
            value: idString,
            inline: true
        }, {
            name: language.levelName,
            value: levelString,
            inline: true
        }, {
            name: language.platformName,
            value: platformString,
            inline: true
        });
        callback(message);
    };
    /**
     * Callback an {@link Embed} message with error
     * @param {ErrorResponse} err - Error information
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     * @todo Handle rate exceeded error
     */
    OWView.prototype.printError = function (err, lang, callback) {
        var language = require("../../resources/lang/" + lang + ".json").error;
        var message = this.getEmbedError();
        message.embed.title = language.errorTitle;
        if (err.error_desc === "Private profile") {
            message.embed.fields.push({
                name: language.errorFieldName,
                value: language.errorFieldValuePrivate
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
    return OWView;
}(view_1.View));
exports.OWView = OWView;
