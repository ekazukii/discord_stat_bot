"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var Discord = require("discord.js");
// @ts-ignore
var SQLite3 = require("sqlite3");
var wynncraft_1 = require("./controller/wynncraft");
var hivemc_1 = require("./controller/hivemc");
var coinflip_1 = require("./controller/coinflip");
var lol_1 = require("./controller/lol");
var lang_1 = require("./controller/lang");
var help_1 = require("./controller/help");
var hypixel_1 = require("./controller/hypixel");
var coc_1 = require("./controller/coc");
var csgo_1 = require("./controller/csgo");
var ow_1 = require("./controller/ow");
var winston_1 = require("winston");
function main(options) {
    var dtoken = options.dicord_token;
    var xboxkey = options.xbox_key;
    var riotapi = options.riotapi;
    var hypixelapi = options.hypixelapi;
    var cocapi = options.cocapi;
    var csgoapi = options.csgoapi;
    var client = new Discord.Client();
    var sqlite3 = SQLite3.verbose();
    var logger = winston_1.createLogger({
        level: 'info',
        exitOnError: false,
        format: winston_1.format.json(),
        transports: [
            new winston_1.transports.File({ filename: "./logs/log.log", options: { flags: "w" } }),
        ],
    });
    var langController, lolController, coinflipController, hivemcController, wynncraftController, hypixelController, helpController, cocController, csgoController, owController;
    if (!fs.existsSync(path.join(__dirname, "../db"))) {
        fs.mkdirSync(path.join(__dirname, "../db"));
    }
    var db = new sqlite3.Database(path.join(__dirname, "../db/servers.db"), function (err) {
        if (err) {
            console.error(err.message);
        }
        db.run("CREATE TABLE IF NOT EXISTS servers (sid text PRIMARY KEY, lang text NOT NULL);");
        console.log("Connected to the servers database.");
        client.login(dtoken);
    });
    client.on('ready', function () {
        // @ts-ignore
        logger.info("Logged in as " + client.user.tag + "!");
        console.log(lol_1.LoLController);
        lolController = new lol_1.LoLController(client, riotapi);
        langController = new lang_1.LangController(client, db);
        hypixelController = new hypixel_1.HypixelController(client, hypixelapi);
        coinflipController = new coinflip_1.CoinflipController(client);
        hivemcController = new hivemc_1.HivemcController(client);
        wynncraftController = new wynncraft_1.WynncraftController(client);
        helpController = new help_1.HelpController(client);
        cocController = new coc_1.CoCController(client, cocapi);
        csgoController = new csgo_1.CSGOController(client, csgoapi);
        owController = new ow_1.OWController(client);
    });
    var StatsD = require('hot-shots');
    var ddstats = new StatsD({ errorHandler: function (err) {
            logger.error(err);
        } });
    client.on('message', function (userMessage) {
        var lang;
        if (userMessage.content.charAt(0) === '$') {
            var channel = userMessage.channel;
            logger.info("receive command (message start by $)", { guildId: channel.guild.id, content: userMessage.content });
            // Get language of the server where the message comes from
            db.all("SELECT lang FROM servers WHERE sid = ?", channel.guild.id, function (err, rows) {
                if (err) {
                    console.log(err);
                }
                ;
                if (rows.length === 1) {
                    // Set lang to the fetched language
                    lang = rows[0].lang;
                }
                else {
                    // Set the default language to english and insert in db
                    db.run("INSERT INTO servers (sid, lang) VALUES(?,?)", channel.guild.id, "en_EN");
                    lang = "en_EN";
                }
                var args = userMessage.content.split(" ");
                var command = args[0];
                args.shift();
                var startDate = new Date();
                switch (command) {
                    case "$wynncraft":
                        ddstats.increment("bot.wynncraft.command", ["command"]);
                        wynncraftController.command(args, lang, function (embed) {
                            var endDate = new Date();
                            ddstats.timing("bot.wynncraft.command.timer", endDate.getTime() - startDate.getTime());
                            userMessage.channel.send(embed);
                        });
                        break;
                    case "$hivemc":
                        ddstats.increment("bot.hivemc.command", ["command"]);
                        hivemcController.command(args, lang, function (embed) {
                            var endDate = new Date();
                            ddstats.timing("bot.hivemc.command.timer", endDate.getTime() - startDate.getTime());
                            userMessage.channel.send(embed);
                        });
                        break;
                    case "$hypixel":
                        ddstats.increment("bot.hypixel.command", ["command"]);
                        hypixelController.command(args, lang, function (embed) {
                            userMessage.channel.send(embed);
                            var endDate = new Date();
                            ddstats.timing("bot.wynncraft.command.timer", endDate.getTime() - startDate.getTime());
                        });
                        break;
                    case "$coinflip":
                        ddstats.increment("bot.coinflip.command", ["command"]);
                        coinflipController.command(args, lang, function (embed) {
                            userMessage.channel.send(embed);
                            var endDate = new Date();
                            ddstats.timing("bot.coinflip.command.timer", endDate.getTime() - startDate.getTime(), ["sub:" + args[0]]);
                        });
                        break;
                    case "$lol":
                        ddstats.increment("bot.lol.command", ["command"]);
                        lolController.command(args, lang, function (embed) {
                            var endDate = new Date();
                            ddstats.timing("bot.lol.command.timer", endDate.getTime() - startDate.getTime(), ["sub:" + args[0]]);
                            userMessage.channel.send(embed);
                        });
                        break;
                    case "$lang":
                        ddstats.increment("bot.lang.command", ["command"]);
                        langController.command(args, lang, parseInt(channel.guild.id), function (embed) {
                            var endDate = new Date();
                            ddstats.timing("bot.lang.command.timer", endDate.getTime() - startDate.getTime(), ["sub:" + args[0]]);
                            userMessage.channel.send(embed);
                        });
                        break;
                    case "$help":
                        ddstats.increment("bot.help.command", ["command"]);
                        helpController.command(args, lang, function (embed) {
                            var endDate = new Date();
                            ddstats.timing("bot.help.command.timer", endDate.getTime() - startDate.getTime());
                            userMessage.channel.send(embed);
                        });
                        break;
                    case "$coc":
                        ddstats.increment("bot.coc.command", ["command"]);
                        cocController.command(args, lang, function (embed) {
                            var endDate = new Date();
                            ddstats.timing("bot.coc.command.timer", endDate.getTime() - startDate.getTime());
                            userMessage.channel.send(embed);
                        });
                        break;
                    case "$csgo":
                        ddstats.increment("bot.csgo.command", ["command"]);
                        csgoController.command(args, lang, function (embed) {
                            var endDate = new Date();
                            ddstats.timing("bot.csgo.command.timer", endDate.getTime() - startDate.getTime());
                            userMessage.channel.send(embed);
                        });
                        break;
                    case "$ow":
                        ddstats.increment("bot.ow.command", ["command"]);
                        owController.command(args, lang, function (embed) {
                            var endDate = new Date();
                            ddstats.timing("bot.ow.command.timer", endDate.getTime() - startDate.getTime());
                            userMessage.channel.send(embed);
                        });
                        break;
                    default:
                        break;
                }
            });
        }
    });
}
;
exports = main;
// TYPEDEF FOR JSDOCS
/**
 * @typedef {Object} DiscordUser - {@link https://discord.js.org/#/docs/main/stable/class/Client|Discord.js Client} of the discord bot.
 * @property {string} username - The display name of the discord bot
 * @property {function():string} displayAvatarURL - URL of the profile picture of the bot
 */
/**
 * @typedef {Object} DiscordClient - {@link https://discord.js.org/#/docs/main/stable/class/Client|Discord.js Client} of the discord bot.
 * @property {DiscordUser} user
 */
/**
 * @typedef {Object} Embed
 * @property {number} color - rgb color in decimal value {@link https://convertingcolors.com/decimal-color-16744576.html|online converter}
 * @property {{name: string, icon_url: string}} author - "Header" of the message.
 * @property {string} url - URL of the link in title
 * @property {Array.<{name: string, value: string}>} fields - Fields are like content of discord embed
 * @property {Date} timestamp - Time at the bot of the message
 * @property {{text: string}} footer - Footer of the message
 */
/**
* @typedef {Object} DiscordMessage
* @property {Embed} embed
*/
/**
 * Callback passed through all the steps (Given to the Controller, then to the View which will return an Embed)
 * @callback messageCallback
 * @param {Embed} embed
 */
