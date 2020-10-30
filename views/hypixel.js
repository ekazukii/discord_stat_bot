const View = require("./view.js");
/**
 * View of Hypixel command
 * @extends View
 */
class HypixelView extends View {

    /**
     * @param {DiscordUser} bot - User property of bot instance
     */
    constructor(bot) {
        super(bot)
    }

    /**
     * Array of number of wins in different minigames
     * @typedef WinsArray
     * @type {Array}
     * @property {number} 0 - SkyWars wins
     * @property {number} 1 - BuildBattle wins
     * @property {number} 2 - UHC wins
     * @property {number} 3 - SpeedUHC wins
     * @property {number} 4 - BedWars wins
     */

    /**
     * Callback an {@link Embed} message with user statistics
     * @param {Object} stats 
     * @param {WinsArray} stats.wins - Number of wins in different minigames
     * @param {string} [stats.guild] - Player's guild name
     * @param {string} [stats.rank] - Player's rank
     * @param {boolean} stats.status - if the player is online or not
     * @param {number} stats.plevel - Network level of the player
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
    showUserStats(stats, lang, callback) { 
        console.log(stats);
        var language = require(`./lang/${lang}.json`).hypixel;
        var message = this.getEmbed()
        message.embed.title = language.statsTitle.replace("{arg1}", stats.username);
        var valueString = "";
        for (let i = 0; i < stats.wins.length; i++) {
            valueString += stats.wins[i] + "\r";
        }

        var guildString, rankString, statusString;

        if(typeof stats.guild !== "undefined") {
            guildString = stats.guild;
        } else {
            guildString = language.noGuild;
        }

        
        if(typeof stats.rank !== "undefined") {
            rankString = stats.rank;
        } else {
            rankString = language.noRank;
        }

        if(stats.status) {
            statusString = language.statusOnline;
        } else {
            statusString = language.statusOffline;
        }

        message.embed.fields.push({
            name: language.guildTitle,
            value: guildString,
            inline: true
        }, {
            name: language.rankTitle,
            value: rankString,
            inline: true
        }, {
            name: "Level",
            value: stats.plevel,
            inline: true
        }, {
            name: language.listGamesName,
            value: language.listGamesValue,
            inline: true
        }, {
            name: language.numberVictories,
            value: valueString,
            inline: true
        }, {
            name: language.statusTitle,
            value: statusString
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

module.exports = HypixelView;