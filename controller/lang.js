const LangView = require("../views/lang.js");
const LangModel = require("../models/lang.js");

module.exports = class HivemcController {
    constructor(client, db) {
        this.client = client;
        this.model = new LangModel(db);
        this.view = new LangView(client.user);
    }

    command(args, lang, sid, callback) {
        this.changeLang(args[0], lang, sid, callback);
    }

    changeLang(newLang, lang, sid, callback) {
        var self = this;
        this.model.changeLang(newLang, sid, function(err) {
            if(err) {
                self.view.langNotExist(err, lang, function(embed) {
                    callback(embed);
                });
            } else {
                self.view.showChangeLang(newLang, function(embed) {
                    callback(embed);
                });
            }

        });
    }
}
