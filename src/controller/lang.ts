import { LangView } from '../views/lang';
import { LangModel } from '../models/lang';

/** Controller for Lang command */
export class LangController {
  client: any;
  model: LangModel;
  view: LangView;

  /**
   * @todo Instanciate model and view in constructor.
   * @param {DiscordClient} client
   * @param {Object} db - {@link https://www.npmjs.com/package/sqlite3|SQLITE DB Object}
   */
  constructor(client: any, db: any) {
    this.client = client;
    this.model = new LangModel(db);
    this.view = new LangView(client.user);
  }

  /**
   * Process command with command arguments (in this case always do changeLang only command)
   * @param {Array<string>} args - Command arguments
   * @param {string} lang - Current language of the bot
   * @param {number} sid - Discord server identifier
   * @param {messageCallback} callback
   */
  command(args: Array<string>, lang: string, sid: number, callback: Function) {
    this.changeLang(args[0], lang, sid, callback);
  }

  /**
   * Ask the model to fetch statistics and send them to the view, then callback the message created in view
   * @param {string} newLang - New language of the bot
   * @param {string} lang - Current language of the bot
   * @param {number} sid - Discord server identifier
   * @param {messageCallback} callback
   */
  changeLang(newLang: string, lang: string, sid: number, callback: Function) {
    var self = this;
    this.model.changeLang(newLang, sid, function (err: any) {
      if (err) {
        self.view.langNotExist(err, lang, function (embed: any) {
          callback(embed);
        });
      } else {
        self.view.showChangeLang(newLang, function (embed: any) {
          callback(embed);
        });
      }
    });
  }
}
