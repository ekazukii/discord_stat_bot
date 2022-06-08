import { View } from './view';
import { ErrorResponse, HypyxelStats } from '../types';

/**
 * View of Hypixel command
 * @extends View
 */
export class HypixelView extends View {
  /**
   * @param {DiscordUser} bot - User property of bot instance
   */
  constructor(bot: any) {
    super(bot);
  }

  /**
   * Callback an {@link Embed} message with user statistics
   * @param {HypyxelStats} stats
   * @param {string} lang - Current language of the bot
   * @param {messageCallback} callback
   */
  showUserStats(stats: HypyxelStats, lang: string, callback: Function) {
    console.log(stats);
    var language = require(`../../resources/lang/${lang}.json`).hypixel;
    var message = this.getEmbed();
    message.embed.title = language.statsTitle.replace('{arg1}', stats.username);
    var valueString = '';
    for (let i = 0; i < stats.wins.length; i++) {
      valueString += stats.wins[i] + '\r';
    }

    var guildString, rankString, statusString;

    if (typeof stats.guild !== 'undefined') {
      guildString = stats.guild;
    } else {
      guildString = language.noGuild;
    }

    if (typeof stats.rank !== 'undefined') {
      rankString = stats.rank;
    } else {
      rankString = language.noRank;
    }

    if (stats.status) {
      statusString = language.statusOnline;
    } else {
      statusString = language.statusOffline;
    }

    message.embed.fields.push(
      {
        name: language.guildTitle,
        value: guildString,
        inline: true,
      },
      {
        name: language.rankTitle,
        value: rankString,
        inline: true,
      },
      {
        name: 'Level',
        value: stats.plevel,
        inline: true,
      },
      {
        name: language.listGamesName,
        value: language.listGamesValue,
        inline: true,
      },
      {
        name: language.numberVictories,
        value: valueString,
        inline: true,
      },
      {
        name: language.statusTitle,
        value: statusString,
      }
    );
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
    message.embed.fields.push({
      name: language.errorFieldName,
      value: language.errorFieldValue,
    });
    callback(message);
  }
}
