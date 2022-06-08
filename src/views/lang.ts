import { View } from './view';
/**
 * View of Lang command
 * @extends View
 */
export class LangView extends View {
  /**
   * @param {DiscordUser} bot - User property of bot instance
   */
  constructor(bot: any) {
    super(bot);
  }

  /**
   * Callback an {@link Embed} message with the confirmation of language change.
   * @param {string} lang - New language of the discord bot
   * @param {messageCallback} callback
   */
  showChangeLang(lang: string, callback: Function) {
    var language = require(`../../resources/lang/${lang}.json`).lang;
    var message = this.getEmbed();
    message.embed.title = language.langTitle;
    message.embed.fields.push({
      name: language.langFieldName,
      value: language.langFieldValue,
    });
    callback(message);
  }

  /**
   * Callback an {@link Embed} message with error lang doest not exist
   * @param {Object} err - Error object
   * @param {Array<string>} err.listLang - List of supported language
   * @param {string} lang - Current lang of the bot
   * @param {messageCallback} callback
   */
  langNotExist(err: any, lang: string, callback: Function) {
    var language = require(`../../resources/lang/${lang}.json`).lang;
    var message = this.getEmbedError();
    message.embed.title = language.langUnknownTitle;
    message.embed.fields.push({
      name: language.langUnknownFieldName,
      value: err.listLang.join(' - '),
    });
    callback(message);
  }
}
