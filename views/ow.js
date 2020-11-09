const View = require("./view.js");
/**
 * View of Clash of Clans command
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