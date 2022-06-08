import { View } from './view';
import { ErrorResponse, WynncraftStats } from '../types';

/**
 * View of Wynncraft command
 * @extends View
 */
export class WynncraftView extends View {
  /**
   * @param {DiscordUser} bot - User property of bot instance
   */
  constructor(bot: any) {
    super(bot);
  }

  /**
   * Callback an {@link Embed} message with user statistics
   * @param {WynncraftStats} stats
   * @param {string} lang - Current language of the bot
   * @param {messageCallback} callback
   */
  showUserStats(stats: WynncraftStats, lang: string, callback: Function) {
    var language = require(`../../resources/lang/${lang}.json`).wynncraft;
    var message = this.getEmbed();
    message.embed.title = language.statsTitle.replace('{arg1}', stats.username);
    message.embed.fields.push(
      {
        name: language.statsFieldClassName,
        value: stats.className,
      },
      {
        name: language.statsFieldLevelName,
        value: stats.classLevel,
      },
      {
        name: language.statsFieldDungeonsName,
        value: stats.completedDungeons,
      },
      {
        name: language.statsFieldQuestsName,
        value: stats.completedQuests,
      },
      {
        name: language.statsFieldMobsName,
        value: stats.mobsKilled,
      }
    );
    callback(message);
  }

  /**
   * Callback an {@link Embed} message with user not found error
   * @param {Object} err - Error information
   * @param {string} lang - Current language of the bot
   * @param {messageCallback} callback
   * @todo Handle rate exceeded error
   */
  printError(stats: ErrorResponse, lang: string, callback: Function) {
    var language = require(`../../resources/lang/${lang}.json`).error;
    var message = this.getEmbedError();
    message.embed.title = language.errorTitle;
    message.embed.fields.push({
      name: language.errorFieldName,
      value: language.errorFieldValue,
    });
    callback(message);
  }
}
