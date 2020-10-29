const HelpController = require("./controller/help.js");

module.exports = function(options) {
    var dtoken = options.dicord_token;
    var xboxkey = options.xbox_key;
    var riotapi = options.riotapi;
    
    const fs = require("fs");
    const path = require("path");
    const Discord = require('discord.js');
    const client = new Discord.Client();
    const sqlite3 = require("sqlite3").verbose();

    const WynncraftController = require("./controller/wynncraft.js");
    const HivemcController = require("./controller/hivemc.js");
    const CoinflipController = require("./controller/coinflip.js");
    const LoLController = require("./controller/lol.js");
    const LangController = require("./controller/lang.js");
    const HelpController = require("./controller/help.js");
    
    var langController, lolController, coinflipController, hivemcController, wynncraftController, helpController;

    if (!fs.existsSync(path.join(__dirname, "/db"))){
        fs.mkdirSync(path.join(__dirname, "/db"));
    }

    let db = new sqlite3.Database(path.join(__dirname, "/db/servers.db"), (err) => {
        if (err) {
          console.error(err.message);
        }
        db.run("CREATE TABLE IF NOT EXISTS servers (sid text PRIMARY KEY, lang text NOT NULL);");
        console.log("Connected to the servers database.");
        client.login(dtoken)
    });

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setStatus('visible');
        
        lolController = new LoLController(client, riotapi);
        langController = new LangController(client, db);
        coinflipController = new CoinflipController(client);
        hivemcController = new HivemcController(client);
        wynncraftController = new WynncraftController(client);
        helpController = new HelpController(client);
    });

    client.on('message', userMessage => {
        var lang;
        if (userMessage.content.charAt(0) === '$') {

            // Get language of the server where the message comes from
            db.all("SELECT lang FROM servers WHERE sid = ?", userMessage.channel.guild.id, function(err, rows) {
                if(err) {
                    console.log(err)
                };

                if(rows.length === 1) {
                    // Set lang to the fetched language
                    lang = rows[0].lang;
                } else {
                    // Set the default language to english and insert in db
                    db.run("INSERT INTO servers (sid, lang) VALUES(?,?)", userMessage.channel.guild.id, "en_EN");
                    lang = "en_EN";
                }

                var args = userMessage.content.split(" ");
                var command = args[0];
                args.shift();

                switch (command) {
                    case "$wynncraft":
                        wynncraftController.command(args, lang, (embed) => {
                            userMessage.channel.send(embed);
                        });
                        break;
                    case "$hivemc":
                        hivemcController.command(args, lang, (embed) => {
                            userMessage.channel.send(embed);
                        });
                        break;
                    case "$coinflip":
                        coinflipController.command(args, lang, (embed) => {
                            userMessage.channel.send(embed);
                        });
                        break;
                    case "$lol":
                        lolController.command(args, lang, (embed) => {
                            userMessage.channel.send(embed);
                        })
                        break;
                    case "$lang":
                        langController.command(args, lang, userMessage.channel.guild.id, (embed) => {
                            userMessage.channel.send(embed);
                        })
                        break;
                    case "$help":
                        helpController.command(args, lang,  (embed) => {
                            userMessage.channel.send(embed);
                        });
                    default:
                        break;
                }
            });
        }
    });
};

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

