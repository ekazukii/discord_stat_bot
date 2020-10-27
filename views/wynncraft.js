const View = require("./view.js");

/**
 * View of Wynncraft command
 * @extends View
 */
class WynncraftView extends View {

    /**
     * @param {DiscordUser} bot - User property of bot instance
     */
    constructor(bot) {
        super(bot);
    }

    
    /**
     * Callback an {@link Embed} message with user statistics
     * @param {Object} stats 
     * @param {string} stats.username - Username of the player
     * @param {string} stats.className - Name of the main character's class
     * @param {number} stats.classLevel - Level of the main character's class
     * @param {number} stats.completedDungeons - Number of completed dungeons
     * @param {number} stats.completedQuests - Number of completed quests
     * @param {number} stats.mobsKilled - Number of mobs killed
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
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
    
    /**
     * Callback an {@link Embed} message with user not found error
     * @param {Object} err - Error information 
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     * @todo Handle rate exceeded error
     */
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

module.exports = WynncraftView;
