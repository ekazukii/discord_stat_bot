const View = require("./view.js");
module.exports = class HivemcView extends View {
    constructor(bot) {
        super(bot)
    }

    showChangeLang(lang, callback) {
        var language = require(`./lang/${lang}.json`).lang;
        var message = this.getEmbed()
        message.embed.title = language.langTitle;
        message.embed.fields.push({
            name: language.langFieldName,
            value: language.langFieldValue
        });
        callback(message);
    }

    langNotExist(err, lang, callback) {
        var language = require(`./lang/${lang}.json`).lang;
        var message = this.getEmbedError()
        message.embed.title = language.langUnknownTitle
        message.embed.fields.push({
            name: language.langUnknownFieldName,
            value: err.listLang.join(" - ")
        });
        callback(message);
    }
}
