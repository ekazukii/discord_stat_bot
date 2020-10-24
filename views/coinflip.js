const View = require("./view.js");
module.exports = class CoinflipView extends View {
  constructor(bot) {
    super(bot);
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
