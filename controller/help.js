const HelpView = require("../views/help.js");

/** Controller for Lang command */
class HelpController {

    /**
     * @todo Instanciate model and view in constructor.
     * @param {DiscordClient} client 
     * @param {Object} db - {@link https://www.npmjs.com/package/sqlite3|SQLITE DB Object} 
     */
    constructor(client) {
        this.client = client;
        this.view = new HelpView(client.user);
    }

    /**
     * Process command with command arguments (in this case always do getHelp only command)
     * @param {Array<string>} args - Command arguments
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
    command(args, lang, callback) {
        this.getHelp(lang, callback);
    }

    /**
     * Show help page to user
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
    getHelp(lang, callback) {
        this.view.showHelp(lang, callback);
    }
}

module.exports = HelpController;