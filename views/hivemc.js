const View = require("./view.js");
/**
 * View of Hivemc command
 * @extends View
 */
class HivemcView extends View {

    /**
     * @param {DiscordUser} bot - User property of bot instance
     */
    constructor(bot) {
        super(bot)
    }

    /**
     * Callback an {@link Embed} message with user statistics
     * @param {Object} stats 
     * @param {number} stats.hide - Number of hide and seek win
     * @param {number} stats.grav - Number of gravity win
     * @param {number} stats.blockparty - Number of blockparty win
     * @param {number} stats.deathrun - Number of deathrun win
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
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

    /**
     * Callback an {@link Embed} message with user not found error
     * @param {Object} err - Error information 
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     * @todo Handle rate exceeded error
     */
    printError(err, lang, callback) {
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

module.exports = HivemcView;