const View = require("./view.js");
module.exports = class WynncraftView extends View {
    constructor(bot) {
        super(bot);
    }

    showUserStats(stats, lang, callback) {
        var language = require(`./lang/${lang}.json`).wynncraft;
        var message = this.getEmbed()
        message.embed.title = language.statsTitle.replace("{arg1}", stats.username);
        message.embed.fields.push({
            name: language.statsFieldClassName,
            value: stats.className
            }, {
            name: language.statsFieldLevelName,
            value: stats.classLevel
            }, {
            name: language.statsFieldDungeonsName,
            value: stats.completedDungeons
            }, {
            name: language.statsFieldQuestsName,
            value: stats.completedQuests
            }, {
            name: language.statsFieldMobsName,
            value: stats.mobsKilled
        });
        callback(message)
    }

    printError(stats, lang, callback) {
        var language = require(`./lang/${lang}.json`).error;
        var message = this.getEmbedError()
        message.embed.title = language.errorTitle
        message.embed.fields.push({
            name: language.errorFieldName,
            value: language.errorFieldValue
        });
        callback(message);
    }
}
