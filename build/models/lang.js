"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LangModel = void 0;
/** Model for Lang command */
var LangModel = /** @class */ (function () {
    /**
     * Cache the db object in class property.
     * @param {Object} db - {@link https://www.npmjs.com/package/sqlite3|SQLITE DB Object}
     */
    function LangModel(db) {
        this.db = db;
        this.langList = ["en_EN", "fr_FR"];
    }
    /**
     * Change the language of the bot
     * @param {string} lang - New language of the bot
     * @param {number} sid - Discord server identifier
     * @param {function(Object)} callback  - Callback to controller if err send list of supported language
     */
    LangModel.prototype.changeLang = function (lang, sid, callback) {
        if (this.langList.includes(lang)) {
            this.db.run("UPDATE servers SET lang = ? WHERE sid = ?", lang, sid);
            callback();
        }
        else {
            callback({ listLang: this.langList });
        }
    };
    return LangModel;
}());
exports.LangModel = LangModel;
