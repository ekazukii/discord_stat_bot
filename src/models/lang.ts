/** Model for Lang command */
export class LangModel {

    db: any;
    langList: Array<String>;
    
    /**
     * Cache the db object in class property.
     * @param {Object} db - {@link https://www.npmjs.com/package/sqlite3|SQLITE DB Object} 
     */
    constructor(db: any) {
        this.db = db;
        this.langList = ["en_EN", "fr_FR"];
    }

    /**
     * Change the language of the bot
     * @param {string} lang - New language of the bot
     * @param {number} sid - Discord server identifier
     * @param {function(Object)} callback  - Callback to controller if err send list of supported language
     */
    changeLang(lang: string, sid: number, callback: Function) {
        if(this.langList.includes(lang)) {
            this.db.run("UPDATE servers SET lang = ? WHERE sid = ?", lang, sid);
            callback();
        } else {
            callback({listLang: this.langList});
        }
    }
}
