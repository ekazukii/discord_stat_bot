module.exports = function(options) {
  var con = options.con
  var app = options.app

  const Discord = require('discord.js');
  const client = new Discord.Client();
  
  const Mojang = require("./models/mojang.js")
  const Wynncraft = require("./models/wynncraft.js")
  const Hivemc = require("./models/hivemc.js")
  const Sot = require("./models/sot.js")
  
  const HivemcV = require("./views/hivemc.js")
  const SotV = require("./views/sot.js")
  const WynncraftV = require("./views/wynncraft.js")
  
  const WynncraftController = require("./controller/wynncraft.js");
  var wynncraftController = new WynncraftController(client);
  
  const HivemcController = require("./controller/hivemc.js");
  var hivemcController = new HivemcController(client);
  
  const SotController = require("./controller/sot.js");
  var sotController = new SotController(client);
  
  const CoinflipController = require("./controller/coinflip.js");
  var coinflipController = new CoinflipController(client);
  
  const GmailController = require("./controller/gmail.js");
  var gmailController;
  
  const HomeworkController = require("./controller/homework.js");
  var homeworkController;
  
  gmailController = new GmailController(client, con)
  homeworkController = new HomeworkController(client, con)
  
  const mcping = require('mc-ping-updated');
  
  
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus('invisible');
    //client.user.setActivity("Dort paisiblement.");
  });
  
  client.on('message', rawMessage => {
    if (rawMessage.content.charAt(0) === '$') {
      var args = rawMessage.content.split(" ");
      var command = args[0];
      args.shift();
  
      switch (command) {
        case "$wynncraft":
          wynncraftController.command(args, (embed) => {
            rawMessage.channel.send(embed);
          });
          break;
        case "$hivemc":
          hivemcController.command(args, (embed) => {
            rawMessage.channel.send(embed);
          });
          break;
        case "$sot":
          sotController.command(args, (embed) => {
            rawMessage.channel.send(embed);
          });
          break;
        case "$dd":
  
          break;
        case "$coinflip":
          coinflipController.command(args, (embed) => {
            rawMessage.channel.send(embed);
          });
          break;
        case "$listen":
          gmailController.command(args, rawMessage, (embed)  => {
            rawMessage.channel.send(embed);
          })
        case "$devoirs":
          homeworkController.command(args, (embed)  => {
            rawMessage.channel.send(embed);
          })
        default:
  
      }
    }
  });
  
  client.login(process.env.DISCORD_TOKEN)
  const request = require('request');
  
  mcping(process.env.SERVER_IP, process.env.SERVER_PORT, function(err, res) {
    if (err) {
      console.error(err);
    } else {
      //console.log(res);
      console.log(res.players.sample)
    }
  }, 3000);  
};

