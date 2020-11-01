const View = require("./view.js");
/**
 * View of Clash of Clans command
 * @extends View
 */
class CoCView extends View {

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
        var language = require(`./lang/${lang}.json`).coc;
        var message = this.getEmbed();
        message.embed.title = language.statsTitle.replace("{arg1}", stats.name);
        
        var heroString = "", levelString = "", levelMaxString = "";

        for (let i = 0; i < stats.heroes.length; i++) {
            const hero = stats.heroes[i];
            heroString += hero.name + "\r";
            levelString += hero.level + "\r";
            levelMaxString += hero.maxLevel + "\r";
        }
        
        message.embed.fields.push({
            name: language.statsFieldUsername,
            value: stats.name,
            inline: true
        }, {
            name: language.statsFieldLevel,
            value: stats.level,
            inline: true
        }, {
            name: language.statsFieldTownHallLevel,
            value: stats.townHallLevel,
            inline: true
        }, {
            name: language.statsFieldHeroName,
            value: heroString,
            inline: true
        }, {
            name: language.statsFieldHeroLevel,
            value: levelString,
            inline: true
        }, {
            name: language.statsFieldHeroMaxLevel,
            value: levelMaxString,
            inline: true
        }, {
            name: language.statsFieldTrophies,
            value: stats.trophies,
            inline: true
        }, {
            name: language.statsFieldClanName,
            value: stats.clan.name,
            inline: true
        }, {
            name: language.statsFieldClanTag,
            value: stats.clan.tag,
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
        if(err.error_desc === "invalid ip") {
            message.embed.fields.push({
                name: language.errorFieldName,
                value: language.errorFieldValueIp
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

module.exports = CoCView;