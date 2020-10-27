/** 
 * Abstract class for Views of different games
 * @abstract
 */
class View {
  /**
   * 
   * @param {DiscordUser} bot 
   */
  constructor(bot) {
    this.bot = bot
  }

  /**
   * Template function for getting basic Embed
   * @returns {DiscordMessage}
   */
  getEmbed() {
    /**
     * @type {{embed: Embed}}
     */
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
          text: "Stats Bot"
        }
      }
    };
    return message;
  }

  /**
   * Template function for getting errors Embed
   * @returns {DiscordMessage}
   */
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
          text: "Stats Bot"
        }
      }
    };
    return message;
  }
}

module.exports = View;
