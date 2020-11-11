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
exports.CoinflipView = void 0;
var view_1 = require("./view");
/**
 * View of Lang command
 * @extends View
 */
var CoinflipView = /** @class */ (function (_super) {
    __extends(CoinflipView, _super);
    function CoinflipView(bot) {
        return _super.call(this, bot) || this;
    }
    /**
     * Callback an {@link Embed} message with either Heads or Tails
     * @param {number} winner - Either 0 or 1 (0 --> Heads, 1 --> Tails)
     * @param {string} lang - New language of the discord bot
     * @param {messageCallback} callback
     */
    CoinflipView.prototype.showCoinflip = function (winner, lang, callback) {
        var language = require("../../resources/lang/" + lang + ".json").coinflip;
        var options = [language.heads, language.tails];
        var message = this.getEmbed();
        message.embed.title = language.coinflipTitle;
        message.embed.fields.push({
            name: "************",
            value: language.coinflipValue.replace("{arg1}", options[winner])
        });
        callback(message);
    };
    /**
     * Callback an {@link Embed} message with the option chosen among the list
     * @param {Array<string>} options - List of options
     * @param {index} winner - Index of the picked option.
     * @param {string} lang - New language of the discord bot
     * @param {messageCallback} callback
     */
    CoinflipView.prototype.showPickOption = function (options, winner, lang, callback) {
        var language = require("../../resources/lang/" + lang + ".json").coinflip;
        var message = this.getEmbed();
        message.embed.title = language.pickTitle;
        message.embed.fields.push({
            name: language.pickFieldName.replace("{arg1}", options.join(" , ")),
            value: language.pickFieldValue.replace("{arg1}", options[winner])
        });
        callback(message);
    };
    return CoinflipView;
}(view_1.View));
exports.CoinflipView = CoinflipView;
