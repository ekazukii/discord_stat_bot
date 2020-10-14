const View = require("./view.js");
module.exports = class HomeworkView extends View {
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

  addHomework(date, subject, description, callback) {
    var message = this.getEmbed();
    message.embed.title = "Ajout d'un devoir de "+ subject + " Le " + date + " : \""+description+"\"";
    callback(message);
  }

  removeHomework(id,callback) {
    var message = this.getEmbed();
    message.embed.title = "Suppression du devoirs d'id : "+id;
    callback(message)
  }

  listHomeworks(data, callback) {
    var message = this.getEmbed();
    message.embed.title = "Liste des tout les devoirs";
    data.forEach(element => {
      message.embed.fields.push({
        name: element.date.toISOString().split("T")[0] + " id : " + element.id,
        value: element.subject + " : " + element.description
      })
    });
    callback(message)
  }

  printError(reason, callback) {
    var message = this.getEmbedError()
    message.embed.title = "Erreur";
    message.embed.fields.push({
      name: 'Erreur lors de la requete',
      value: reason
    });

    callback(message);
  }
}
