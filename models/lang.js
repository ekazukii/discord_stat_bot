module.exports = class WynncraftModel {
    constructor(db) {
        this.db = db;
        this.langList = ["en_EN", "fr_FR"];
    }

    changeLang(lang, sid, callback) {
        if(this.langList.includes(lang)) {
            console.log("run model")
            this.db.run("UPDATE servers SET lang = ? WHERE sid = ?", lang, sid);
            callback()
        } else {
            callback({listLang: this.langList});
        }
    }
}
