const View = require("./view.js");
module.exports = class LoLView extends View {
    constructor(bot) {
      super(bot)
    }

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
