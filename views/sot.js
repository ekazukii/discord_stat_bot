const View = require("./view.js");
module.exports = class SotView extends View {
  constructor(bot) {
    super(bot);
  }

  showUserStats(stats, callback) {
    var message = this.getEmbed()
    message.embed.title = "Statistique de "+ stats.username + " Sur Sea of thieves"
    message.embed.fields.push({
      name: 'Nombre de coffres vendus',
      value: stats.chests
    }, {
      name: "Nombre de cranes vendus",
      value: stats.skulls
    }, {
      name: "Nombre de caisses vendus",
      value: stats.crates
    }, {
      name: "Nombre de mètres parcourus",
      value: stats.distance
    }, {
      name: "Nombre de quêtes finis",
      value: stats.quests
    }, {
      name: "Nombre d'îles parcourus",
      value: stats.isles
    });
    callback(message);
  }

  printError(stats, callback) {
    var error_message;
    if (stats.error_desc = "user not found") {
      error_message = "L'utilisateur n'existe pas."
    } else {
      error_message = "L'utilisateur ne joue pas à Sea of Thieves."
    }

    var message = this.getEmbedError()
    message.embed.title = "Erreur"
    message.embed.fields.push({
      name: 'Erreur lors de la requete',
      value: error_message
    });
    callback(message);
  }
}
