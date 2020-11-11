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
exports.WynncraftView = void 0;
var view_1 = require("./view");
/**
 * View of Wynncraft command
 * @extends View
 */
var WynncraftView = /** @class */ (function (_super) {
    __extends(WynncraftView, _super);
    /**
     * @param {DiscordUser} bot - User property of bot instance
     */
    function WynncraftView(bot) {
        return _super.call(this, bot) || this;
    }
    /**
     * Callback an {@link Embed} message with user statistics
     * @param {WynncraftStats} stats
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    WynncraftView.prototype.showUserStats = function (stats, lang, callback) {
        var language = require("../../resources/lang/" + lang + ".json").wynncraft;
        var message = this.getEmbed();
        message.embed.title = language.statsTitle.replace("{arg1}", stats.username);
        message.embed.fields.push({
            name: language.statsFieldClassName,
            value: stats.className
        }, {
            name: language.statsFieldLevelName,
            value: stats.classLevel
        }, {
            name: language.statsFieldDungeonsName,
            value: stats.completedDungeons
        }, {
            name: language.statsFieldQuestsName,
            value: stats.completedQuests
        }, {
            name: language.statsFieldMobsName,
            value: stats.mobsKilled
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
    WynncraftView.prototype.printError = function (stats, lang, callback) {
        var language = require("../../resources/lang/" + lang + ".json").error;
        var message = this.getEmbedError();
        message.embed.title = language.errorTitle;
        message.embed.fields.push({
            name: language.errorFieldName,
            value: language.errorFieldValue
        });
        callback(message);
    };
    return WynncraftView;
}(view_1.View));
exports.WynncraftView = WynncraftView;
