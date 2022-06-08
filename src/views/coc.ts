import { View } from './view';
import { ErrorResponse, CoCStats } from '../types';
/**
 * View of Clash of Clans command
 * @extends View
 */
export class CoCView extends View {
  /**
   * @param {DiscordUser} bot - User property of bot instance
   */
  constructor(bot: any) {
    super(bot);
  }

  /**
   * Callback an {@link Embed} message with user statistics
   * @param {CoCStats} stats
   * @param {string} lang - Current language of the bot
   * @param {messageCallback} callback
   */
  showUserStats(stats: CoCStats, lang: string, callback: Function) {
    var language = require(`../../resources/lang/${lang}.json`).coc;
    var message = this.getEmbed();
    message.embed.title = language.statsTitle.replace('{arg1}', stats.name);

    message.embed.fields.push(
      {
        name: language.statsFieldUsername,
        value: stats.name,
        inline: true,
      },
      {
        name: language.statsFieldLevel,
        value: stats.level,
        inline: true,
      },
      {
        name: language.statsFieldTownHallLevel,
        value: stats.townHallLevel,
        inline: true,
      }
    );

    if (stats.heroes.length > 0) {
      var heroString = '',
        levelString = '',
        levelMaxString = '';

      for (let i = 0; i < stats.heroes.length; i++) {
        const hero = stats.heroes[i];
        heroString += hero.name + '\r';
        levelString += hero.level + '\r';
        levelMaxString += hero.maxLevel + '\r';
      }

      message.embed.fields.push(
        {
          name: language.statsFieldHeroName,
          value: heroString,
          inline: true,
        },
        {
          name: language.statsFieldHeroLevel,
          value: levelString,
          inline: true,
        },
        {
          name: language.statsFieldHeroMaxLevel,
          value: levelMaxString,
          inline: true,
        }
      );
    }

    message.embed.fields.push({
      name: language.statsFieldTrophies,
      value: stats.trophies,
      inline: true,
    });

    if (typeof stats.clan !== 'undefined') {
      message.embed.fields.push(
        {
          name: language.statsFieldClanName,
          value: stats.clan.name,
          inline: true,
        },
        {
          name: language.statsFieldClanTag,
          value: stats.clan.tag,
          inline: true,
        }
      );
    }
    callback(message);
  }

  /**
   * Callback an {@link Embed} message with user not found error
   * @param {ErrorResponse} err - Error information
   * @param {string} lang - Current language of the bot
   * @param {messageCallback} callback
   * @todo Handle rate exceeded error
   */
  printError(err: ErrorResponse, lang: string, callback: Function) {
    var language = require(`../../resources/lang/${lang}.json`).error;
    var message = this.getEmbedError();
    message.embed.title = language.errorTitle;
    if (err.error_desc === 'invalid ip') {
      message.embed.fields.push({
        name: language.errorFieldName,
        value: language.errorFieldValueIp,
      });
    } else {
      message.embed.fields.push({
        name: language.errorFieldName,
        value: language.errorFieldValue,
      });
    }
    callback(message);
  }
}
