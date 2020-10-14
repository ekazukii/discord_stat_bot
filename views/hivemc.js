const View = require("./view.js");
module.exports = class HivemcView extends View {
  constructor(bot) {
    super(bot)
  }

  showUserStats(stats, callback) {
    var message = this.getEmbed()
    message.embed.title = "Statistique de "+ stats.username + " Sur HiveMC"
    message.embed.fields.push({
      name: 'Nombre de victoires en Hide and Seek',
      value: stats.hide
    }, {
      name: "Nombre de victoires en gravity",
      value: stats.grav
    }, {
      name: "Nombre de victoires en blockparty",
      value: stats.blockparty
    }, {
      name: "Nombre de victoires en deathrun",
      value: stats.deathrun
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
