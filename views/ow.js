const View = require("./view.js");
/**
 * View of Overwatch command
 * @extends View
 */
class OWView extends View {

    /**
     * @param {DiscordUser} bot - User property of bot instance
     */
    constructor(bot) {
        super(bot)
    }

    /**
     * Callback an {@link Embed} message with user statistics
     * @param {Object} stats 
     * @param {sring} stats.username - Username of player
     * @param {number} stats.gamesPlayed - Number of games played by the player (quickgame and ranked)
     * @param {nuumber} stats.winrate - Winrate percentage of the player (quickgame and ranked)
     * @param {string} stats.hours - Hours played
     * @param {array} stats.heroes - Most played heroes
     * @param {string} stats.heroes[].name - Name of the hero
     * @param {string} stats.heroes[].hours - Hours spent with the hero
     * @param {array} stats.ranks - Rank in differents roles
     * @param {number} stats.ranks[].sr - Skill rating (elo)
     * @param {string} stats.ranks[].rankName - Name of the rank (gold, diamond ...)
     * @param {number} stats.ranks[].role - Role of the rank
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
    showUserStats(stats, lang, callback) { 
        var language = require(`./lang/${lang}.json`).ow;
        var message = this.getEmbed();
        message.embed.title = language.statsTitle.replace("{arg1}", stats.username);
    
        message.embed.fields.push({
            name: language.gamesPlayedName,
            value: stats.gamesPlayed,
            inline: true
        }, {
            name: language.winrateName,
            value: stats.winrate,
            inline: true
        }, {
            name: language.hoursName,
            value: stats.hours,
            inline: true
        });

        if(stats.heroes.length > 0) {
            var heroNameString = "", heroHourString = "";

            for (let i = 0; i < stats.heroes.length; i++) {
                heroNameString += stats.heroes[i].name + "\r";
                heroHourString += stats.heroes[i].hours + "\r";
            }
            
            message.embed.fields.push({
                name: language.topName,
                value: "1\r2\r3",
                inline: true
            }, {
                name: language.heroName,
                value: heroNameString,
                inline: true
            }, {
                name: language.heroHours,
                value: heroHourString,
                inline: true
            });
        }

        if(stats.ranks.length > 0) {
            var srString = "", rankNameString = "", roleString = "";

            for (let i = 0; i < stats.ranks.length; i++) {
                srString += stats.ranks[i].sr + "\r";
                rankNameString += stats.ranks[i].rankName + "\r";
                roleString += stats.ranks[i].role + "\r";
            }

            message.embed.fields.push({
                name: language.skillRatingName,
                value: srString,
                inline: true
            }, {
                name: language.rankName,
                value: rankNameString,
                inline: true
            }, {
                name: language.rankRoleName,
                value: roleString,
                inline: true
            });
        }

        callback(message);
    }

    /**
     * Callback an {@link Embed} message with users founded
     * @param {Object} stats
     * @param {string} stats.username - Username researched
     * @param {array} stats.users
     * @param {string} stats.users[].urlName - Id of the player
     * @param {string} stats.users[].playerLevel - Level of the player
     * @param {string} stats.users[].platform - Platform of the player (pc, psn, xbl, nintendo-switch)
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
    showSearch(stats, lang, callback) { 
        var language = require(`./lang/${lang}.json`).ow;
        var message = this.getEmbed();
        message.embed.title = language.searchTitle.replace("{arg1}", stats.username);

        var idString = "", levelString = "", platformString = "";

        for (let i = 0; i < stats.users.length; i++) {
            idString += stats.users[i].urlName + "\r";
            levelString += stats.users[i].playerLevel + "\r";
            platformString += stats.users[i].platform + "\r";
        }

        if(stats.more) {
            idString += "......................\r";
            levelString += ".......\r";
            platformString += "......\r";
        }
        
        message.embed.fields.push({
            name: language.idName,
            value: idString,
            inline: true
        }, {
            name: language.levelName,
            value: levelString,
            inline: true
        }, {
            name: language.platformName,
            value: platformString,
            inline: true
        });

        callback(message);
    }

    /**
     * Callback an {@link Embed} message with error
     * @param {Object} err - Error information 
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     * @todo Handle rate exceeded error
     */
    printError(err, lang, callback) {
        var language = require(`./lang/${lang}.json`).error;
        var message = this.getEmbedError();
        message.embed.title = language.errorTitle;
        if(err.error_desc === "Private profile") {
            message.embed.fields.push({
                name: language.errorFieldName,
                value: language.errorFieldValuePrivate
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

module.exports = OWView;