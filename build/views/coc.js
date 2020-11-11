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
exports.CoCView = void 0;
var view_1 = require("./view");
/**
 * View of Clash of Clans command
 * @extends View
 */
var CoCView = /** @class */ (function (_super) {
    __extends(CoCView, _super);
    /**
     * @param {DiscordUser} bot - User property of bot instance
     */
    function CoCView(bot) {
        return _super.call(this, bot) || this;
    }
    /**
     * Callback an {@link Embed} message with user statistics
     * @param {Object} stats
     * @param {sring} stats.name - Username of player
     * @param {number} stats.level - Level of the player
     * @param {nuumber} stats.townHallLevel - Level of player's Town Hall
     * @param {number} stats.trophies - Trophies of the player
     * @param {Object} stats.clan - if the player is online or not
     * @param {number} stats.clan.name - Name of the clan
     * @param {number} stats.clan.tag - Tag of the clan
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    CoCView.prototype.showUserStats = function (stats, lang, callback) {
        var language = require("../../resources/lang/" + lang + ".json").coc;
        var message = this.getEmbed();
        message.embed.title = language.statsTitle.replace("{arg1}", stats.name);
        message.embed.fields.push({
            name: language.statsFieldUsername,
            value: stats.name,
            inline: true
        }, {
            name: language.statsFieldLevel,
            value: stats.level,
            inline: true
        }, {
            name: language.statsFieldTownHallLevel,
            value: stats.townHallLevel,
            inline: true
        });
        if (stats.heroes.length > 0) {
            var heroString = "", levelString = "", levelMaxString = "";
            for (var i = 0; i < stats.heroes.length; i++) {
                var hero = stats.heroes[i];
                heroString += hero.name + "\r";
                levelString += hero.level + "\r";
                levelMaxString += hero.maxLevel + "\r";
            }
            message.embed.fields.push({
                name: language.statsFieldHeroName,
                value: heroString,
                inline: true
            }, {
                name: language.statsFieldHeroLevel,
                value: levelString,
                inline: true
            }, {
                name: language.statsFieldHeroMaxLevel,
                value: levelMaxString,
                inline: true
            });
        }
        message.embed.fields.push({
            name: language.statsFieldTrophies,
            value: stats.trophies,
            inline: true
        });
        if (typeof stats.clan !== "undefined") {
            message.embed.fields.push({
                name: language.statsFieldClanName,
                value: stats.clan.name,
                inline: true
            }, {
                name: language.statsFieldClanTag,
                value: stats.clan.tag,
                inline: true
            });
        }
        callback(message);
    };
    /**
     * Callback an {@link Embed} message with user not found error
     * @param {Object} err - Error information
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     * @todo Handle rate exceeded error
     */
    CoCView.prototype.printError = function (err, lang, callback) {
        var language = require("../../resources/lang/" + lang + ".json").error;
        var message = this.getEmbedError();
        message.embed.title = language.errorTitle;
        if (err.error_desc === "invalid ip") {
            message.embed.fields.push({
                name: language.errorFieldName,
                value: language.errorFieldValueIp
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
    return CoCView;
}(view_1.View));
exports.CoCView = CoCView;
