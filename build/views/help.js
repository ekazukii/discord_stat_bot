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
exports.HelpView = void 0;
var view_1 = require("./view");
/**
 * View of Help command
 * @extends View
 */
var HelpView = /** @class */ (function (_super) {
    __extends(HelpView, _super);
    /**
     * @param {DiscordUser} bot - User property of bot instance
     */
    function HelpView(bot) {
        return _super.call(this, bot) || this;
    }
    HelpView.prototype.showHelp = function (lang, callback) {
        var language = require("../../resources/lang/" + lang + ".json").help;
        var message = this.getEmbed();
        message.embed.title = language.helpTitle;
        message.embed.fields.push({
            name: language.helpName,
            value: "https://ekazuki.fr/discord#commands"
        });
        callback(message);
    };
    return HelpView;
}(view_1.View));
exports.HelpView = HelpView;
