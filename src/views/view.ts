/**
 * Abstract class for Views of different games
 * @abstract
 */
import * as types from '../types';
export class View {
  bot: any;

  /**
   *
   * @param {DiscordUser} bot
   */
  constructor(bot: any) {
    this.bot = bot;
  }

  /**
   * Template function for getting basic Embed
   * @returns {DiscordMessage}
   */
  getEmbed(): types.MessageEmbed {
    var message = {
      embed: {
        color: 344703,
        author: {
          name: this.bot.username,
          icon_url: this.bot.displayAvatarURL(),
        },
        url: 'http://github.com/ekazukii',
        // @ts-ignore
        fields: [],
        timestamp: new Date(),
        footer: {
          text: 'Stats Bot',
        },
      },
    };
    return message;
  }

  /**
   * Template function for getting errors Embed
   * @returns {DiscordMessage}
   */
  getEmbedError(): types.MessageEmbed {
    var message = {
      embed: {
        color: 'bf1919',
        author: {
          name: this.bot.username,
          icon_url: this.bot.displayAvatarURL(),
        },
        title: 'Erreur',
        url: 'http://github.com/ekazukii',
        // @ts-ignore
        fields: [],
        timestamp: new Date(),
        footer: {
          text: 'Stats Bot',
        },
      },
    };
    return message;
  }
}
