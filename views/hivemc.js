const View = require("./view.js");
const langJSON = require("./lang/fr_FR.json")
const language = langJSON.hivemc;
const error = langJSON.error;

module.exports = class HivemcView extends View {
    constructor(bot) {
        super(bot)
    }

    showUserStats(stats, callback) {
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

    printError(stats, callback) {
        var message = this.getEmbedError()
        message.embed.title = error.errorTitle
        message.embed.fields.push({
            name: error.errorFieldName,
            value: error.errorFieldValue
        });
        callback(message);
    }
}
