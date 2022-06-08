import { HypixelView } from '../views/hypixel';
import { HypixelModel } from '../models/hypixel';

/** Controller for Hypixel command */
export class HypixelController {
  model: HypixelModel;
  view: HypixelView;

  /**
   * @todo Instanciate model and view in constructor.
   * @param {string} api_key - Hypixel API key
   * @param {DiscordClient} client
   */
  constructor(client: any, api_key: string) {
    this.model = new HypixelModel(api_key);
    this.view = new HypixelView(client.user);
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
    var self = this;
    this.model.getUserStats({ username: username }, function (stats: any) {
      stats.username = username;
      if (stats.error) {
        self.view.printError(stats, lang, function (embed: any) {
          callback(embed);
        });
      } else {
        self.view.showUserStats(stats, lang, function (embed: any) {
          callback(embed);
        });
      }
    });
  }
}
