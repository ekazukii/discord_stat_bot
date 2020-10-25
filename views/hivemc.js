const View = require("./view.js");
module.exports = class HivemcView extends View {
    constructor(bot) {
        super(bot)
    }

    showUserStats(stats, lang, callback) {
        var language = require(`./lang/${lang}.json`).hivemc;
        var message = this.getEmbed()
        message.embed.title = language.statsTitle.replace("{arg1}", stats.username);
        message.embed.fields.push({
            name: language.statsHideAndSeek,
            value: stats.hide
        }, {
            name: language.statsGravity,
            value: stats.grav
        }, {
            name: language.statsBlockparty,
            value: stats.blockparty
        }, {
            name: language.statsDeathrun,
            value: stats.deathrun
        });
        callback(message);
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
