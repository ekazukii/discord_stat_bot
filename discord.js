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
    var wynncraftController = new WynncraftController(client);

    const HivemcController = require("./controller/hivemc.js");
    var hivemcController = new HivemcController(client);

    const CoinflipController = require("./controller/coinflip.js");
    var coinflipController = new CoinflipController(client);

    const LoLController = require("./controller/lol.js");
    var lolController;

    const LangController = require("./controller/lang.js");
    var langController;

    const mcping = require('mc-ping-updated');

    if (!fs.existsSync(path.join(__dirname, "/db"))){
        fs.mkdirSync(path.join(__dirname, "/db"));
    }

    let db = new sqlite3.Database(path.resolve(__dirname, "/db/servers.db"), (err) => {
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
    });

    client.on('message', rawMessage => {
        var lang = "en_EN";
        db.all("SELECT lang FROM servers WHERE sid = ?", rawMessage.channel.guild.id, function(err, rows) {
            if(err) {
                console.log(err)
            };

            if(rows.length === 1) {
                lang = rows[0].lang;
            } else {
                db.run("INSERT INTO servers (sid, lang) VALUES(?,?)", rawMessage.channel.guild.id, "en_EN");
            }

            if (rawMessage.content.charAt(0) === '$') {
                var args = rawMessage.content.split(" ");
                var command = args[0];
                args.shift();

                switch (command) {
                    case "$wynncraft":
                        wynncraftController.command(args, lang, (embed) => {
                            rawMessage.channel.send(embed);
                        });
                        break;
                    case "$hivemc":
                        hivemcController.command(args, lang, (embed) => {
                            rawMessage.channel.send(embed);
                        });
                        break;
                    case "$coinflip":
                        coinflipController.command(args, lang, (embed) => {
                            rawMessage.channel.send(embed);
                        });
                        break;
                    case "$lol":
                        lolController.command(args, lang, (embed) => {
                            rawMessage.channel.send(embed);
                        })
                        break;
                    case "$lang":
                        langController.command(args, lang, rawMessage.channel.guild.id, (embed) => {
                            rawMessage.channel.send(embed);
                        })
                    default:

                }
            }
        });
    });

    mcping(process.env.SERVER_IP, process.env.SERVER_PORT, function(err, res) {
        if (err) {
            console.error(err);
        } else {
            //console.log(res);
            console.log(res.players.sample)
        }
    }, 3000);  
};

