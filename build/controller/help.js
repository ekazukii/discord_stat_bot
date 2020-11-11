"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpController = void 0;
var help_1 = require("../views/help");
/** Controller for Lang command */
var HelpController = /** @class */ (function () {
    /**
     * @todo Instanciate model and view in constructor.
     * @param {DiscordClient} client
     * @param {Object} db - {@link https://www.npmjs.com/package/sqlite3|SQLITE DB Object}
     */
    function HelpController(client) {
        this.client = client;
        this.view = new help_1.HelpView(client.user);
    }
    /**
     * Process command with command arguments (in this case always do getHelp only command)
     * @param {Array<string>} args - Command arguments
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    HelpController.prototype.command = function (args, lang, callback) {
        this.getHelp(lang, callback);
    };
    /**
     * Show help page to user
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    HelpController.prototype.getHelp = function (lang, callback) {
        this.view.showHelp(lang, callback);
    };
    return HelpController;
}());
exports.HelpController = HelpController;
