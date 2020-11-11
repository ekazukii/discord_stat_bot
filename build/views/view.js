"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.View = void 0;
var View = /** @class */ (function () {
    /**
     *
     * @param {DiscordUser} bot
     */
    function View(bot) {
        this.bot = bot;
    }
    /**
     * Template function for getting basic Embed
     * @returns {DiscordMessage}
     */
    View.prototype.getEmbed = function () {
        var message = {
            embed: {
                color: 344703,
                author: {
                    name: this.bot.username,
                    icon_url: this.bot.displayAvatarURL()
                },
                url: "http://github.com/ekazukii",
                // @ts-ignore
                fields: [],
                timestamp: new Date(),
                footer: {
                    text: "Stats Bot"
                }
            }
        };
        return message;
    };
    /**
     * Template function for getting errors Embed
     * @returns {DiscordMessage}
     */
    View.prototype.getEmbedError = function () {
        var message = {
            embed: {
                color: 'bf1919',
                author: {
                    name: this.bot.username,
                    icon_url: this.bot.displayAvatarURL()
                },
                title: "Erreur",
                url: "http://github.com/ekazukii",
                // @ts-ignore
                fields: [],
                timestamp: new Date(),
                footer: {
                    text: "Stats Bot"
                }
            }
        };
        return message;
    };
    return View;
}());
exports.View = View;
