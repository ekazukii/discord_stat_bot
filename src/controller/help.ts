import { HelpView } from '../views/help';

/** Controller for Lang command */
export class HelpController {
  client: any;
  view: HelpView;

  /**
   * @todo Instanciate model and view in constructor.
   * @param {DiscordClient} client
   * @param {Object} db - {@link https://www.npmjs.com/package/sqlite3|SQLITE DB Object}
   */
  constructor(client: any) {
    this.client = client;
    this.view = new HelpView(client.user);
  }

  /**
   * Process command with command arguments (in this case always do getHelp only command)
   * @param {Array<string>} args - Command arguments
   * @param {string} lang - Current language of the bot
   * @param {messageCallback} callback
   */
  command(args: Array<string>, lang: string, callback: Function) {
    this.getHelp(lang, callback);
  }

  /**
   * Show help page to user
   * @param {string} lang - Current language of the bot
   * @param {messageCallback} callback
   */
  getHelp(lang: string, callback: Function) {
    this.view.showHelp(lang, callback);
  }
}
