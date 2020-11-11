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
exports.LangView = void 0;
var view_1 = require("./view");
/**
 * View of Lang command
 * @extends View
 */
var LangView = /** @class */ (function (_super) {
    __extends(LangView, _super);
    /**
     * @param {DiscordUser} bot - User property of bot instance
     */
    function LangView(bot) {
        return _super.call(this, bot) || this;
    }
    /**
     * Callback an {@link Embed} message with the confirmation of language change.
     * @param {string} lang - New language of the discord bot
     * @param {messageCallback} callback
     */
    LangView.prototype.showChangeLang = function (lang, callback) {
        var language = require("../../resources/lang/" + lang + ".json").lang;
        var message = this.getEmbed();
        message.embed.title = language.langTitle;
        message.embed.fields.push({
            name: language.langFieldName,
            value: language.langFieldValue
        });
        callback(message);
    };
    /**
     * Callback an {@link Embed} message with error lang doest not exist
     * @param {Object} err - Error object
     * @param {Array<string>} err.listLang - List of supported language
     * @param {string} lang - Current lang of the bot
     * @param {messageCallback} callback
     */
    LangView.prototype.langNotExist = function (err, lang, callback) {
        var language = require("../../resources/lang/" + lang + ".json").lang;
        var message = this.getEmbedError();
        message.embed.title = language.langUnknownTitle;
        message.embed.fields.push({
            name: language.langUnknownFieldName,
            value: err.listLang.join(" - ")
        });
        callback(message);
    };
    return LangView;
}(view_1.View));
exports.LangView = LangView;
