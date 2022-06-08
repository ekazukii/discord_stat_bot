import * as fs from 'fs';
import * as path from 'path';
import * as Discord from 'discord.js';
// @ts-ignore
import * as SQLite3 from 'sqlite3';

import { WynncraftController } from './controller/wynncraft';
import { HivemcController } from './controller/hivemc';
import { CoinflipController } from './controller/coinflip';
import { LoLController } from './controller/lol';
import { LangController } from './controller/lang';
import { HelpController } from './controller/help';
import { HypixelController } from './controller/hypixel';
import { CoCController } from './controller/coc';
import { CSGOController } from './controller/csgo';
import { OWController } from './controller/ow';

import { createLogger, format, transports } from 'winston';

function main(options: any) {
  var dtoken = options.dicord_token;
  var xboxkey = options.xbox_key;
  var riotapi = options.riotapi;
  var hypixelapi = options.hypixelapi;
  var cocapi = options.cocapi;
  var csgoapi = options.csgoapi;

  const client = new Discord.Client();
  const sqlite3 = SQLite3.verbose();

  const logger = createLogger({
    level: 'info',
    exitOnError: false,
    format: format.json(),
    transports: [
      new transports.File({
        filename: `./logs/log.log`,
        options: { flags: 'w' },
      }),
    ],
  });

  var langController: LangController,
    lolController: LoLController,
    coinflipController: CoinflipController,
    hivemcController: HivemcController,
    wynncraftController: WynncraftController,
    hypixelController: HypixelController,
    helpController: HelpController,
    cocController: CoCController,
    csgoController: CSGOController,
    owController: OWController;

  if (!fs.existsSync(path.join(__dirname, '../db'))) {
    fs.mkdirSync(path.join(__dirname, '../db'));
  }

  let db = new sqlite3.Database(
    path.join(__dirname, '../db/servers.db'),
    (err: Error) => {
      if (err) {
        console.error(err.message);
      }
      db.run(
        'CREATE TABLE IF NOT EXISTS servers (sid text PRIMARY KEY, lang text NOT NULL);'
      );
      console.log('Connected to the servers database.');
      client.login(dtoken);
    }
  );

  client.on('ready', () => {
    // @ts-ignore
    logger.info(`Logged in as ${client.user.tag}!`);
    console.log(LoLController);
    lolController = new LoLController(client, riotapi);
    langController = new LangController(client, db);
    hypixelController = new HypixelController(client, hypixelapi);
    coinflipController = new CoinflipController(client);
    hivemcController = new HivemcController(client);
    wynncraftController = new WynncraftController(client);
    helpController = new HelpController(client);
    cocController = new CoCController(client, cocapi);
    csgoController = new CSGOController(client, csgoapi);
    owController = new OWController(client);
  });

  var StatsD = require('hot-shots');
  var ddstats = new StatsD({
    errorHandler: (err: Error) => {
      logger.error(err);
    },
  });

  client.on('message', (userMessage) => {
    var lang;
    if (userMessage.content.charAt(0) === '$') {
      var channel = userMessage.channel as Discord.TextChannel;
      logger.info('receive command (message start by $)', {
        guildId: channel.guild.id,
        content: userMessage.content,
      });
      // Get language of the server where the message comes from
      db.all(
        'SELECT lang FROM servers WHERE sid = ?',
        channel.guild.id,
        function (err: Error, rows: Array<any>) {
          if (err) {
            console.log(err);
          }

          if (rows.length === 1) {
            // Set lang to the fetched language
            lang = rows[0].lang;
          } else {
            // Set the default language to english and insert in db
            db.run(
              'INSERT INTO servers (sid, lang) VALUES(?,?)',
              channel.guild.id,
              'en_EN'
            );
            lang = 'en_EN';
          }

          var args = userMessage.content.split(' ');
          var command = args[0];
          args.shift();
          var startDate = new Date();
          switch (command) {
            case '$wynncraft':
              ddstats.increment('bot.wynncraft.command', ['command']);
              wynncraftController.command(args, lang, (embed: any) => {
                var endDate = new Date();
                ddstats.timing(
                  'bot.wynncraft.command.timer',
                  endDate.getTime() - startDate.getTime()
                );
                userMessage.channel.send(embed);
              });
              break;
            case '$hivemc':
              ddstats.increment('bot.hivemc.command', ['command']);
              hivemcController.command(args, lang, (embed: any) => {
                var endDate = new Date();
                ddstats.timing(
                  'bot.hivemc.command.timer',
                  endDate.getTime() - startDate.getTime()
                );
                userMessage.channel.send(embed);
              });
              break;
            case '$hypixel':
              ddstats.increment('bot.hypixel.command', ['command']);
              hypixelController.command(args, lang, (embed: any) => {
                userMessage.channel.send(embed);
                var endDate = new Date();
                ddstats.timing(
                  'bot.wynncraft.command.timer',
                  endDate.getTime() - startDate.getTime()
                );
              });
              break;
            case '$coinflip':
              ddstats.increment('bot.coinflip.command', ['command']);
              coinflipController.command(args, lang, (embed: any) => {
                userMessage.channel.send(embed);
                var endDate = new Date();
                ddstats.timing(
                  'bot.coinflip.command.timer',
                  endDate.getTime() - startDate.getTime(),
                  ['sub:' + args[0]]
                );
              });
              break;
            case '$lol':
              ddstats.increment('bot.lol.command', ['command']);
              lolController.command(args, lang, (embed: any) => {
                var endDate = new Date();
                ddstats.timing(
                  'bot.lol.command.timer',
                  endDate.getTime() - startDate.getTime(),
                  ['sub:' + args[0]]
                );
                userMessage.channel.send(embed);
              });
              break;
            case '$lang':
              ddstats.increment('bot.lang.command', ['command']);
              langController.command(
                args,
                lang,
                parseInt(channel.guild.id),
                (embed: any) => {
                  var endDate = new Date();
                  ddstats.timing(
                    'bot.lang.command.timer',
                    endDate.getTime() - startDate.getTime(),
                    ['sub:' + args[0]]
                  );
                  userMessage.channel.send(embed);
                }
              );
              break;
            case '$help':
              ddstats.increment('bot.help.command', ['command']);
              helpController.command(args, lang, (embed: any) => {
                var endDate = new Date();
                ddstats.timing(
                  'bot.help.command.timer',
                  endDate.getTime() - startDate.getTime()
                );
                userMessage.channel.send(embed);
              });
              break;
            case '$coc':
              ddstats.increment('bot.coc.command', ['command']);
              cocController.command(args, lang, (embed: any) => {
                var endDate = new Date();
                ddstats.timing(
                  'bot.coc.command.timer',
                  endDate.getTime() - startDate.getTime()
                );
                userMessage.channel.send(embed);
              });
              break;
            case '$csgo':
              ddstats.increment('bot.csgo.command', ['command']);
              csgoController.command(args, lang, (embed: any) => {
                var endDate = new Date();
                ddstats.timing(
                  'bot.csgo.command.timer',
                  endDate.getTime() - startDate.getTime()
                );
                userMessage.channel.send(embed);
              });
              break;
            case '$ow':
              ddstats.increment('bot.ow.command', ['command']);
              owController.command(args, lang, (embed: any) => {
                var endDate = new Date();
                ddstats.timing(
                  'bot.ow.command.timer',
                  endDate.getTime() - startDate.getTime()
                );
                userMessage.channel.send(embed);
              });
              break;
            default:
              break;
          }
        }
      );
    }
  });
}

export = main;

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
