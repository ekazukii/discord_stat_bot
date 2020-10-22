const View = require("./view.js");
module.exports = class LoLView extends View {
    constructor(bot) {
      super(bot)
    }

    showUserStats(stats, callback) {
        var masteryString = "";
        for (let i = 0; i < stats.masteries.length; i++) {
            masteryString += `[${stats.masteries[i].level}] ${stats.masteries[i].name} - ${stats.masteries[i].points} points\r`;
        }

        var gameString = "";
        if(stats.match.win === true || stats.match.win === "true") {
            gameString += "Victoire avec ";
        } else {
            gameString += "Défaite avec ";
        }

        gameString += stats.match.champ + " ";
        gameString += stats.match.kills + "/" + stats.match.deaths + "/" + stats.match.assists + " - ";
        gameString += stats.match.cs + "cs/min";

        var message = this.getEmbed()
        message.embed.title = "Statistiques de "+ stats.username + " Sur League of Legends"
        message.embed.fields.push({
            name: "Niveau d'invocateur",
            value: stats.level,
            inline: true
        }, {
            name: "Rank solo/duo queue",
            value: stats.rank,
            inline: true
        }, {
            name: "Maîtrises des champions",
            value: masteryString
        }, {
            name: "Dernière partie",
            value: gameString
        });
        callback(message);
    }

    showUsersComparation(stats, callback) {
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        var score1Total = stats.score1.reduce(reducer);
        var score2Total = stats.score2.reduce(reducer);
        var message = this.getEmbed()
        message.embed.title = stats.user1 + " vs " + stats.user2;

        var title = "Win points : \rKills point : \rDeath malus : \rAssists points : \rCS/min points : \rCCScore points : \rDamage points : \rTank points\r\rScore Total : ";
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
            name: "title",
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

    showUserCS(stats, callback) {
        var message = this.getEmbed()

        message.embed.title = "Creep Score dans les dernières 5 game de " + stats.username;

        var CSString = "";
        for (let i = 0; i < stats.cs.length - 1; i++) {
            CSString += stats.cs[i] + " - ";
        }

        CSString += stats.cs[stats.cs.length - 1]

        message.embed.fields.push({
            name: "Creep Score par minutes",
            value: CSString
        });

        callback(message);
    }

    showChampionRotation(rotation, callback) {
        var message = this.getEmbed()

        message.embed.title = "Rotation actuelle des champions";
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

    printError(stats, callback) {
        var message = this.getEmbedError()
        message.embed.title = "Erreur"
        message.embed.fields.push({
            name: 'Erreur lors de la requete',
            value: "L'utilisaeur n'a pas été trouvé"
        });
        callback(message);
    }
}
