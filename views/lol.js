const View = require("./view.js");
/**
 * View of League of Legends commands
 * @extends View
 */
class LoLView extends View {
    /**
     * @param {DiscordUser} bot - User property of bot instance
     */
    constructor(bot) {
      super(bot)
    }

    /**
     * Callback an {@link Embed} message with user statistics
     * @param {Object} stats - Statistics of the player in one object
     * @param {string} stats.username - Username of the player
     * @param {Array} stats.masteries - List of champ mastery
     * @param {Object} stats.masteries[].level - Level of mastery
     * @param {Object} stats.masteries[].name - Name of the champion
     * @param {Object} stats.masteries[].points - Mastery points w/ this champ
     * @param {Object} stats.match - Stats about last match
     * @param {boolean} stats.match.win - True if player has win
     * @param {string} stats.match.champ - Champion of the player
     * @param {number} stats.match.kills - Number of kills
     * @param {number} stats.match.deaths - Number of deaths
     * @param {number} stats.match.assists - Number of assists
     * @param {number} stats.match.cs - Creep score per minutes
     * @param {number} stats.level - Summoner's level
     * @param {string} stats.rank - Summoner's rank
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    showUserStats(stats, lang, callback) {
        var language = require(`./lang/${lang}.json`).lol;
        var masteryString = "";
        for (let i = 0; i < stats.masteries.length; i++) {
            masteryString += language.masteryFieldValue.replace("{arg1}", stats.masteries[i].level).replace("{arg2}", stats.masteries[i].name).replace("{arg3}", stats.masteries[i].points);
        }

        var gameString = "";
        if(stats.match.win === true || stats.match.win === "true") {
            gameString = language.lastGameWinValue
              .replace("{arg1}", stats.match.champ)
              .replace("{arg2}", stats.match.kills)
              .replace("{arg3}", stats.match.deaths)
              .replace("{arg4}", stats.match.assists)
              .replace("{arg5}", stats.match.cs);
        } else {
            gameString = language.lastGameLooseValue
              .replace("{arg1}", stats.match.champ)
              .replace("{arg2}", stats.match.kills)
              .replace("{arg3}", stats.match.deaths)
              .replace("{arg4}", stats.match.assists)
              .replace("{arg5}", stats.match.cs);
        }

        var message = this.getEmbed()
        message.embed.title = language.statsTitle.replace("{arg1}", stats.username)
        message.embed.fields.push({
            name: language.summonerFieldName,
            value: stats.level,
            inline: true
        }, {
            name: language.rankFieldName,
            value: stats.rank,
            inline: true
        }, {
            name: language.masteryFieldName,
            value: masteryString
        }, {
            name: language.lastGameName,
            value: gameString
        });
        callback(message);
    }

    /**
     * {@link https://github.com/ekazukii/discord_stat_bot/issues/6}
     * @typedef ScoreArray
     * @type {Array}
     * @property {number} 0 - Wins points
     * @property {number} 1 - Kills points
     * @property {number} 2 - Death malus
     * @property {number} 3 - Assists points
     * @property {number} 4 - CS/min points
     * @property {number} 5 - Crowd Control points
     * @property {number} 6 - Damage points
     * @property {number} 7 - Tank points
     */


    /**
     * Callback an {@link Embed} message with user comparison
     * @param {Object} stats - Statistics of the players in one object
     * @param {ScoreArray} stats.score1 - Statistics of first player
     * @param {string} stats.user1 - Username of the first player
     * @param {ScoreArray} stats.score2 - Statistics of second player
     * @param {string} stats.user2 - Username of the second player
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    showUsersComparation(stats, lang, callback) {
        var language = require(`./lang/${lang}.json`).lol;
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        var score1Total = stats.score1.reduce(reducer);
        var score2Total = stats.score2.reduce(reducer);
        var message = this.getEmbed()
        message.embed.title = language.vsTitle.replace("{arg1}", stats.user1).replace("{arg2}", stats.user2);

        var title = language.vsFieldTitleValue;
        var statsString1 = ""; 
        var statsString2 = "";

        for (let i = 0; i < stats.score1.length; i++) {
            if(stats.score1[i] > stats.score2[i]) {
                statsString1 += "**"+stats.score1[i] + " pts**\r";
                statsString2 += stats.score2[i] + " pts\r";
            } else if(stats.score1[i] < stats.score2[i]) {
                statsString1 += stats.score1[i] + " pts\r";
                statsString2 += "**"+stats.score2[i] + " pts**\r";
            } else {
                statsString1 += stats.score1[i] + " pts\r";
                statsString2 += stats.score2[i] + " pts\r";
            }
        }

        if(score1Total > score2Total) {
            statsString1 += "\r**" + score1Total + "**";
            statsString2 += "\r" + score2Total;
        } else if(score1Total < score2Total) {
            statsString1 += "\r" + score1Total;
            statsString2 += "\r**" + score2Total + "**";
        } else {
            statsString1 += "\r" + score1Total;
            statsString2 += "\r" + score2Total;
        }

        message.embed.fields.push({
            name: language.vsFieldTitleName,
            value: title,
            inline: true
        }, {
            name: stats.user1,
            value: statsString1,
            inline: true
        }, {
            name: stats.user2,
            value: statsString2,
            inline: true
        });

        callback(message);
    }

    /**
     * Callback an {@link Embed} message with cs/min over last 5 games of players
     * @param {Object} stats - Statistics of the players in one object
     * @param {string} stats.username - Username of the player
     * @param {number[]} stats.cs - Array of creep score per minutes
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    showUserCS(stats, lang, callback) {
        var language = require(`./lang/${lang}.json`).lol;
        var message = this.getEmbed()

        message.embed.title = language.csTitle.replace("{arg1}", stats.username);

        var CSString = "";
        for (let i = 0; i < stats.cs.length - 1; i++) {
            CSString += stats.cs[i] + " - ";
        }

        CSString += stats.cs[stats.cs.length - 1]

        message.embed.fields.push({
            name: language.csFieldName,
            value: CSString
        });

        callback(message);
    }

    /**
     * Callback an {@link Embed} message with the actual free champs
     * @param {string[]} rotation - Array of champion (by name not id)  
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback
     */
    showChampionRotation(rotation, lang, callback) {
        var language = require(`./lang/${lang}.json`).lol;
        var message = this.getEmbed()

        message.embed.title = language.rotationTitle;
        var leftListString = "";
        var rightListString = "";
        var half = Math.round(rotation.length / 2);

        for (let i = 0; i < half; i++) {
            leftListString += rotation[i] + "\r";
        }

        for (let i = half; i < rotation.length; i++) {
            rightListString += rotation[i] + "\r";
        }

        message.embed.fields.push({
            name: " ------- ",
            value: leftListString,
            inline: true
        }, {
            name: " ------- ",
            value: rightListString,
            inline: true
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

module.exports = LoLView;
