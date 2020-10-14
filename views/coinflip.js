const View = require("./view.js");
module.exports = class CoinflipView extends View {
  constructor(bot) {
    super(bot);
  }

  showUserStats(stats, callback) {
    var message = this.getEmbed()
    message.embed.title = "Statistique de "+ stats.username + " Sur Wynncraft";
    message.embed.fields.push({
      name: 'Type de la classe',
      value: stats.className
    }, {
      name: "Level de la classe",
      value: stats.classLevel
    }, {
      name: "Nombre de dongeons compltétés",
      value: stats.completedDungeons
    }, {
      name: "Nombre de quêtes accomplies",
      value: stats.completedQuests
    }, {
      name: "Nombre de mob tués",
      value: stats.mobsKilled
    });
    callback(message)
  }

  showCoinflip(winner, callback) {
    var options = ["Pile", "Face"];
    var message = this.getEmbed();
    message.embed.title = "Pile ou Face";
    message.embed.fields.push({
      name: "************",
      value: "C'est " + options[winner] + " !"
    });

    callback(message);
  }

  showPickOption(options, winner, callback) {
    var message = this.getEmbed();
    message.embed.title = "Pick Option";
    message.embed.fields.push({
      name: "Parmis : " + options.join(" , "),
      value: "C'est " + options[winner] + " qui a été tiré"
    });

    callback(message);
  }

  printError(stats, callback) {
    var message = this.getEmbedError()
    message.embed.title = "Erreur";
    message.embed.fields.push({
      name: 'Erreur lors de la requete',
      value: "L'utilisaeur n'a pas été trouvé, réessayez avec l'uuid"
    });

    callback(message);
  }
}
