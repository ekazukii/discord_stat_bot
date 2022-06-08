import { HivemcView } from '../views/hivemc';
import { HivemcModel } from '../models/hivemc';

/** Controller for hivemc command */
export class HivemcController {
  client: any;

  /**
   * @todo Instanciate model and view in constructor.
   * @param {DiscordClient} client
   */
  constructor(client: any) {
    this.client = client;
  }

  /**
   * Process command with command arguments (in this case always do userStats only command)
   * @param {Array} args
   * @param {string} lang - Current language of the bot
   * @param {messageCallback} callback
   */
  command(args: Array<string>, lang: string, callback: Function) {
    this.userStats(args[0], lang, callback);
  }

  /**
   * Ask the model to fetch statistics and send them to the view, then callback the message created in view
   * @param {string} username - Minecraft username
   * @param {string} lang - Current language of the bot
   * @param {messageCallback} callback
   */
  userStats(username: string, lang: string, callback: Function) {
    var client = this.client;
    var model = new HivemcModel();
    var view = new HivemcView(client.user);
    model.getUserStats({ username: username }, function (stats: any) {
      stats.username = username;
      if (stats.error) {
        view.printError(stats, lang, function (embed: any) {
          callback(embed);
        });
      } else {
        view.showUserStats(stats, lang, function (embed: any) {
          callback(embed);
        });
      }
    });
  }
}
