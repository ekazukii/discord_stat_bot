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
exports.HivemcView = void 0;
var view_1 = require("./view");
/**
 * View of Hivemc command
 * @extends View
 */
var HivemcView = /** @class */ (function (_super) {
    __extends(HivemcView, _super);
    /**
     * @param {DiscordUser} bot - User property of bot instance
     */
    function HivemcView(bot) {
        return _super.call(this, bot) || this;
    }
    /**
     * Callback an {@link Embed} message with user statistics
     * @param {HivemcStats} stats
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    HivemcView.prototype.showUserStats = function (stats, lang, callback) {
        var language = require("../../resources/lang/" + lang + ".json").hivemc;
        var message = this.getEmbed();
        message.embed.title = language.statsTitle.replace("{arg1}", stats.username);
        message.embed.fields.push({
            name: language.statsHideAndSeek,
            value: stats.hide
        }, {
            name: language.statsGravity,
            value: stats.grav
        }, {
            name: language.statsBlockparty,
            value: stats.blockparty
        }, {
            name: language.statsDeathrun,
            value: stats.deathrun
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
    HivemcView.prototype.printError = function (err, lang, callback) {
        var language = require("../../resources/lang/" + lang + ".json").error;
        var message = this.getEmbedError();
        message.embed.title = language.errorTitle;
        message.embed.fields.push({
            name: language.errorFieldName,
            value: language.errorFieldValue
        });
        callback(message);
    };
    return HivemcView;
}(view_1.View));
exports.HivemcView = HivemcView;
