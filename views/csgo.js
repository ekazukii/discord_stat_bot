const View = require("./view.js");
/**
 * View of Clash of Clans command
 * @extends View
 */
class CSGOView extends View {

    /**
     * @param {DiscordUser} bot - User property of bot instance
     */
    constructor(bot) {
        super(bot)
    }

    /**
     * Callback an {@link Embed} message with user statistics
     * @param {Object} stats 
     * @param {sring} stats.name - Username of player
     * @param {number} stats.level - Level of the player
     * @param {nuumber} stats.townHallLevel - Level of player's Town Hall
     * @param {number} stats.trophies - Trophies of the player
     * @param {Object} stats.clan - if the player is online or not
     * @param {number} stats.clan.name - Name of the clan
     * @param {number} stats.clan.tag - Tag of the clan
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
    showUserStats(stats, lang, callback) { 
        var language = require(`./lang/${lang}.json`).csgo;
        var message = this.getEmbed();
        message.embed.title = language.statsTitle.replace("{arg1}", stats.username);
    
        message.embed.fields.push({
            name: language.lvlName,
            value: stats.lvl,
            inline: true
        }, {
            name: language.eloName,
            value: stats.elo,
            inline: true
        }, {
            name: language.winName,
            value: stats.win + " %",
            inline: true
        }, {
            name: language.hsName,
            value: stats.hs + " %",
            inline: true
        }, {
            name: language.kdName,
            value: stats.kd,
            inline: true
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
        var message = this.getEmbedError();
        message.embed.title = language.errorTitle;
        if(err.error_desc === "User don't play csgo") {
            message.embed.fields.push({
                name: language.errorFieldName,
                value: language.errorFieldValueNotPlayingCSGO
            });
        } else {
            message.embed.fields.push({
                name: language.errorFieldName,
                value: language.errorFieldValue
            });
        }
        callback(message);
    }
}

module.exports = CSGOView;