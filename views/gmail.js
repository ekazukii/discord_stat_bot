const View = require("./view.js");
module.exports = class GmailView extends View {
  constructor(bot) {
    super(bot)
  }

  startListener(callback) {
    var message = this.getEmbed()
    message.embed.title = "Le listener est enregistré"
    message.embed.description = 'Si un prof envoie un mail vous serez prevenu';
    callback(message);
  }

  stopListener(callback) {
    var message = this.getEmbed()
    message.embed.title = "Le listener est stoppé"
    message.embed.description = 'Vous ne serez plus notifié lors de la reception de mails';
    callback(message);
  }

  emailsMatch(data, callback) {
    var message = this.getEmbed()
    message.embed.title = "Nouveau mail"
    message.embed.fields.push({
      name: "Nouveau mail d'un prof",
      value: data.email
    });
    callback(message);
  }

  printError(data, callback) {
    var message = this.getEmbedError()
    message.embed.title = "Erreur"
    message.embed.fields.push({
      name: 'Erreur lors de la requete',
      value: data.error
    });
    callback(message);
  }

  addToListener(mail, callback) {
    var message = this.getEmbed()
    message.embed.title = "L'email est bien ajouté"
    message.embed.description = 'Vous serez désormais notifié a l\'arrivé d\'un mail de '+mail;
    callback(message);
  }

  removeFromListener(mail, callback) {
    var message = this.getEmbed()
    message.embed.title = "L'email est bien enlevé"
    message.embed.description = 'Vous ne serez plus notifié a l\'arrivé d\'un mail de '+mail;
    callback(message);
  }

  listSenders(data, callback) {
    var message = this.getEmbed()
    message.embed.title = "Le bot vous notifiera des nouveaux mails des personnes suivantes"
    for (let i = 0; i < data.length; i++) {
      const element = data[i].email;
      message.embed.fields.push({name: "email n°"+i, value: data[i].email});
    }
    callback(message)
  }
}
