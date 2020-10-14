module.exports = class View {
  constructor(bot) {
    this.bot = bot
  }

  getEmbed() {
    var message = {
      embed: {
        color: 344703,
        author: {
          name: this.bot.username,
          icon_url: this.bot.displayAvatarURL()
        },
        url: "http://github.com/ekazukii",
        fields: [],
        timestamp: new Date(),
        footer: {
          icon_url: this.bot.avatarURL,
          text: "Stats Bot"
        }
      }
    };
    return message;
  }

  getEmbedError() {
    var message = {
      embed: {
        color: 'bf1919',
        author: {
          name: this.bot.username,
          icon_url: this.bot.displayAvatarURL()
        },
        title: "Erreur",
        url: "http://github.com/ekazukii",
        fields: [],
        timestamp: new Date(),
        footer: {
          icon_url: this.bot.avatarURL,
          text: "Stats Bot"
        }
      }
    };
    return message;
  }
}
