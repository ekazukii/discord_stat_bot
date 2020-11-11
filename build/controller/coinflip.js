"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinflipController = void 0;
var coinflip_js_1 = require("../views/coinflip.js");
/** Controller for CoinFlip command */
var CoinflipController = /** @class */ (function () {
    /**
     * @todo Instanciate view in constructor.
     * @param {DiscordClient} client
     */
    function CoinflipController(client) {
        this.client = client;
    }
    /**
     * Process command with command arguments and do either CoinflipController#coinflip either CoinflipController#pickOption
     * @param {Array<string>} args - Command arguments
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    CoinflipController.prototype.command = function (args, lang, callback) {
        if (args.length > 1) {
            this.pickOption(args, lang, callback);
        }
        else {
            this.coinflip(lang, callback);
        }
    };
    /**
     * Do a coinflip and send result to view, then callback embed message.
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    CoinflipController.prototype.coinflip = function (lang, callback) {
        var client = this.client;
        var view = new coinflip_js_1.CoinflipView(client.user);
        var winner = getRandomInt(2);
        view.showCoinflip(winner, lang, function (embed) {
            callback(embed);
        });
    };
    /**
     * Pick randomly an argument in the args Array
     * @param {Array<string>} args - Command arguments
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    CoinflipController.prototype.pickOption = function (args, lang, callback) {
        var client = this.client;
        var view = new coinflip_js_1.CoinflipView(client.user);
        var winner = getRandomInt(args.length);
        view.showPickOption(args, winner, lang, function (embed) {
            callback(embed);
        });
    };
    return CoinflipController;
}());
exports.CoinflipController = CoinflipController;
/**
 * get random integer from 0 to max
 * @param {number} max
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
