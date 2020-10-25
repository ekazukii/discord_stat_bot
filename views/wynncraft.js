const View = require("./view.js");
const langJSON = require("./lang/en_EN.json")
const language = langJSON.wynncraft;
const error = langJSON.error;
module.exports = class WynncraftView extends View {
    constructor(bot) {
        super(bot);
    }

    showUserStats(stats, callback) {
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

    printError(stats, callback) {
        var message = this.getEmbedError()
        message.embed.title = error.errorTitle;
        message.embed.fields.push({
            name: error.errorFieldName,
            value: error.errorFieldValue
        });

        callback(message);
    }
}
