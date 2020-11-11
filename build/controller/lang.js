"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LangController = void 0;
var lang_1 = require("../views/lang");
var lang_2 = require("../models/lang");
/** Controller for Lang command */
var LangController = /** @class */ (function () {
    /**
     * @todo Instanciate model and view in constructor.
     * @param {DiscordClient} client
     * @param {Object} db - {@link https://www.npmjs.com/package/sqlite3|SQLITE DB Object}
     */
    function LangController(client, db) {
        this.client = client;
        this.model = new lang_2.LangModel(db);
        this.view = new lang_1.LangView(client.user);
    }
    /**
     * Process command with command arguments (in this case always do changeLang only command)
     * @param {Array<string>} args - Command arguments
     * @param {string} lang - Current language of the bot
     * @param {number} sid - Discord server identifier
     * @param {messageCallback} callback
     */
    LangController.prototype.command = function (args, lang, sid, callback) {
        this.changeLang(args[0], lang, sid, callback);
    };
    /**
     * Ask the model to fetch statistics and send them to the view, then callback the message created in view
     * @param {string} newLang - New language of the bot
     * @param {string} lang - Current language of the bot
     * @param {number} sid - Discord server identifier
     * @param {messageCallback} callback
     */
    LangController.prototype.changeLang = function (newLang, lang, sid, callback) {
        var self = this;
        this.model.changeLang(newLang, sid, function (err) {
            if (err) {
                self.view.langNotExist(err, lang, function (embed) {
                    callback(embed);
                });
            }
            else {
                self.view.showChangeLang(newLang, function (embed) {
                    callback(embed);
                });
            }
        });
    };
    return LangController;
}());
exports.LangController = LangController;
