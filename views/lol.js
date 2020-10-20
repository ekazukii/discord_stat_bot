const View = require("./view.js");
module.exports = class LoLView extends View {
  constructor(bot) {
    super(bot)
  }

  showUserStats(stats, callback) {
    var masteryString = "";
    for (let i = 0; i < stats.masteries.length; i++) {
      const element = stats.masteries[i];
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
