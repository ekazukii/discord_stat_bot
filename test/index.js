require('dotenv').config();
//require("../discord.js")({dicord_token: process.env.DISCORD_TOKEN, xbox_key: process.env.XBOX_API_KEY, riotapi: process.env.RIOT_API});
var dtoken = process.env.DISCORD_TOKEN;
var xboxkey = process.env.XBOX_API_KEY;
var riotapi = process.env.RIOT_API;
var hypixelapi = process.env.HYPIXEL_API;
var cocapi = process.env.COC_API;
var csgoapi = process.env.CSGO_API;

const Discord = require('discord.js');
const client = new Discord.Client();
const assert = require('assert').strict;
const request = require('request');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const LoLController = require('../build/controller/lol.js');
const WynncraftController = require('../build/controller/wynncraft.js');
const HivemcController = require('../build/controller/hivemc.js');
const CoinflipController = require('../build/controller/coinflip.js');
const HelpController = require('../build/controller/help.js');
const LangController = require('../build/controller/lang.js');
const HypixelController = require('../build/controller/hypixel.js');
const CoCController = require('../build/controller/coc.js');
const CSGOController = require('../build/controller/csgo.js');
const OWController = require('../build/controller/ow.js');

const WynncraftModel = require('../build/models/wynncraft.js');
const LoLModel = require('../build/models/lol.js');
const HivemcModel = require('../build/models/hivemc.js');
const MojangModel = require('../build/models/mojang.js');

var lolController,
  wynncraftController,
  hivemcController,
  hypixelController,
  coinflipController,
  cocController,
  helpController,
  langController,
  csgoController,
  owController;

describe('Discord tests', function () {
  before(function (done) {
    client.on('ready', () => {
      if (!fs.existsSync(path.join(__dirname, '../db'))) {
        fs.mkdirSync(path.join(__dirname, '../db'));
      }

      let db = new sqlite3.Database(
        path.join(__dirname, '../db/servers.db'),
        (err) => {
          if (err) {
            console.error(err.message);
          }
          db.run(
            'CREATE TABLE IF NOT EXISTS servers (sid text PRIMARY KEY, lang text NOT NULL);'
          );
          console.log('Connected to the servers database.');
        }
      );

      client.user.setStatus('visible');
      lolController = new LoLController.LoLController(client, riotapi);
      wynncraftController = new WynncraftController.WynncraftController(client);
      hivemcController = new HivemcController.HivemcController(client);
      coinflipController = new CoinflipController.CoinflipController(client);
      hypixelController = new HypixelController.HypixelController(
        client,
        hypixelapi
      );
      cocController = new CoCController.CoCController(client, cocapi);
      helpController = new HelpController.HelpController(client);
      langController = new LangController.LangController(client, db);
      csgoController = new CSGOController.CSGOController(client, csgoapi);
      owController = new OWController.OWController(client);
      done();
    });
  });

  describe('Models UT', function () {
    describe('League of Legends UT', function () {
      var model = new LoLModel.LoLModel(riotapi);

      it('Should get user statistics', function (done) {
        model.getUserStats({ username: 'ekazukii' }, (stats) => {
          if (typeof stats.match !== 'undefined') {
            done();
          }
        });
      });

      it('Should get current champion rotation', function (done) {
        model.getChampionRotation((champList) => {
          if (champList.length === 15) done();
        });
      });

      it('Should compare ekazukii and ObstinateM', function (done) {
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue;
        model.comparePlayers(
          { user1: 'ekazukii', user2: 'ObstinateM' },
          (stats) => {
            if (
              stats.score1.reduce(reducer) > 20 &&
              stats.score2.reduce(reducer) > 20
            ) {
              done();
            }
          }
        );
      });

      it('Should get user creep score over last 5 games', function (done) {
        lolController.model.getUserCS(
          { username: 'ekazukii', ngame: 5 },
          (stats) => {
            if (stats.cs.length === 5) {
              done();
            }
          }
        );
      });
    });

    describe('Wynncraft UT', function () {
      var model = new WynncraftModel.WynncraftModel();
      it('Should get user statistics', function (done) {
        model.getUserStats({ username: 'zefut' }, (stats) => {
          if (stats.mobsKilled > 1) {
            done();
          }
        });
      });

      it('Should not found the user', function (done) {
        model.getUserStats(
          { username: 'IDONTEXIST444552DJJDHDGZ' },
          (stats) => {
            if (stats.error) {
              done();
            }
          }
        );
      });
    });

    describe('HiveMC UT', function () {
      var model = new HivemcModel.HivemcModel();
      it('Should get user statistics', function (done) {
        model.getUserStats({ username: 'zefut' }, (stats) => {
          if (stats.hide >= 10) {
            done();
          }
        });
      });

      it('Should not found the user', function (done) {
        model.getUserStats(
          { username: 'HIVEMCIDONTEXIST444552DJJDHDGZ' },
          (stats) => {
            if (stats.error) {
              done();
            }
          }
        );
      });
    });

    describe('Mojang UT', function () {
      var model = new MojangModel.MojangModel();
      it('Should get user UUID', function (done) {
        model.getUUIDByUsername('ekazuki', (uuid) => {
          if (uuid === '091c969e-ba6d-4ada-9620-f55038f36e41') {
            done();
          }
        });
      });

      it('Should not found the user  UUID', function (done) {
        model.getUUIDByUsername('MOJANGCIDONTEXIST444552DJJDHDGZ', (stats) => {
          if (stats.error) {
            done();
          }
        });
      });
    });
  });

  describe('Controllers + Views UT', function () {
    describe('League of Legends UT', function () {
      it('Should get user statistics', function (done) {
        lolController.command(['profile', 'ekazukii'], 'fr_FR', (message) => {
          if (
            message.embed.title ===
            'Statistiques de ekazukii sur League of Legends'
          ) {
            done();
          }
        });
      });

      it('Should get user statistics', function (done) {
        lolController.command(['rotation'], 'fr_FR', (message) => {
          if (message.embed.fields.length === 2) {
            done();
          }
        });
      });

      it('Should compare ekazukii and ObstinateM', function (done) {
        lolController.command(
          ['vs', 'ekazukii', 'ObstinateM'],
          'fr_FR',
          (message) => {
            if (message.embed.title === 'ekazukii vs ObstinateM') {
              done();
            }
          }
        );
      });

      it('Should get user creep score over last 5 games', function (done) {
        lolController.command(['cs', 'ekazukii'], 'fr_FR', (message) => {
          if (
            message.embed.title ===
            'Creep Score dans les dernières 5 game de ekazukii'
          ) {
            done();
          }
        });
      });
    });

    describe('Wynncraft UT', function () {
      it('Should get user statistics', function (done) {
        wynncraftController.command(['zefut'], 'fr_FR', (message) => {
          if (message.embed.title === 'Statistiques de zefut sur Wynncraft') {
            done();
          }
        });
      });

      it('Should not found the user', function (done) {
        wynncraftController.command(
          ['IDONTEXISTONWYNNCRAFT778455'],
          'fr_FR',
          (message) => {
            if (message.embed.title === 'Erreur') {
              done();
            }
          }
        );
      });
    });

    describe('HiveMC UT', function () {
      it('Should get user statistics', function (done) {
        hivemcController.command(['Logorrheique'], 'fr_FR', (message) => {
          if (
            message.embed.title === 'Statistiques de Logorrheique sur HiveMC'
          ) {
            done();
          }
        });
      });

      it('Should not found the user', function (done) {
        hivemcController.command(
          ['IDONTEXISTONHIVEMC778455'],
          'fr_FR',
          (message) => {
            if (message.embed.title === 'Erreur') {
              done();
            }
          }
        );
      });
    });

    describe('Hypixel UT', function () {
      it('Should get user statistics', function (done) {
        hypixelController.command(['ekazuki'], 'fr_FR', (message) => {
          if (message.embed.title === 'Statistiques de ekazuki sur Hypixel') {
            done();
          }
        });
      });

      it('Should not found the user', function (done) {
        hypixelController.command(
          ['IDONTEXISTONHIVEMC778455'],
          'fr_FR',
          (message) => {
            if (message.embed.title === 'Erreur') {
              done();
            }
          }
        );
      });
    });

    describe('Clash of Clans UT', function () {
      it('Should get user statistics', function (done) {
        cocController.command(['#YJ8PQQCJ'], 'fr_FR', (message) => {
          if (
            message.embed.title ===
            'Statistiques de AlmostBatman sur Clash of Clans'
          ) {
            done();
          } else if (message.embed.fields[0].value === 'IP invalide') {
            done();
          }
        });
      });

      it('Should not found the user', function (done) {
        cocController.command(
          ['IDONTEXISTONHIVEMC778455'],
          'fr_FR',
          (message) => {
            if (message.embed.title === 'Erreur') {
              done();
            }
          }
        );
      });
    });

    describe('Counter Strike : Global Offensive UT', function () {
      it('Should get user statistics', function (done) {
        csgoController.command(['Ekazuki'], 'fr_FR', (message) => {
          if (message.embed.title === 'Statistiques de Ekazuki sur Faceit') {
            done();
          }
        });
      });

      it("Should found that the user don't play CSGO", function (done) {
        csgoController.command(['DatGuyJesus-'], 'fr_FR', (message) => {
          if (
            message.embed.fields[0].value === "L'utilisateur ne joue pas à CSGO"
          ) {
            done();
          }
        });
      });

      it('Should not found the user', function (done) {
        csgoController.command(
          ['IDONTEXISTONHIVEMC778455CSGOFACEIT'],
          'fr_FR',
          (message) => {
            if (message.embed.title === 'Erreur') {
              done();
            }
          }
        );
      });
    });

    describe('Overwatch UT', function () {
      it('Should get user statistics', function (done) {
        owController.command(
          ['profile', 'MANO-12507', 'pc'],
          'fr_FR',
          (message) => {
            console.log(message.embed.title);
            if (message.embed.title === 'Statistiques de MANO sur Overwatch') {
              done();
            }
          }
        );
      });

      it('Should found a private profile', function (done) {
        owController.command(
          ['profile', 'MANO-31366', 'pc'],
          'fr_FR',
          (message) => {
            if (message.embed.fields[0].value === 'Le profile est en privé') {
              done();
            }
          }
        );
      });

      it('Should not found the user profile', function (done) {
        owController.command(
          ['profile', 'IDONTEXISTINOVERWATCHOIJUHYT4432', 'pc'],
          'fr_FR',
          (message) => {
            if (message.embed.title === 'Erreur') {
              done();
            }
          }
        );
      });

      it('Should found profiles', function (done) {
        owController.command(['search', 'mano'], 'fr_FR', (message) => {
          if (message.embed.title === 'Résultat de la recherche mano') {
            done();
          }
        });
      });

      it('Should not found profile', function (done) {
        owController.command(
          ['search', 'IDONTEXISTINOVERWATCHOIJUHYT6563'],
          'fr_FR',
          (message) => {
            if (message.embed.title === 'Erreur') {
              done();
            }
          }
        );
      });
    });

    describe('Coinflip UT', function () {
      it('Should launch a coin flip', function (done) {
        coinflipController.command([], 'fr_FR', (message) => {
          if (message.embed.title === 'Pile ou Face') {
            done();
          }
        });
      });

      it('Should pick an option', function (done) {
        coinflipController.command(
          ['option1', 'option2'],
          'fr_FR',
          (message) => {
            if (message.embed.title === 'Choisir une option') {
              done();
            }
          }
        );
      });
    });

    describe('Lang UT', function () {
      it('Should change the language of a server', function (done) {
        langController.command(
          ['fr_FR'],
          'fr_FR',
          767375276849233941,
          (message) => {
            if (message.embed.title === 'Changement de langue') {
              done();
            }
          }
        );
      });

      it('Should not change the language of a server', function (done) {
        langController.command(
          ['pirate_PIRATE'],
          'fr_FR',
          767375276849233941,
          (message) => {
            console.log(message.embed.title);
            if (message.embed.title === "La langue n'existe pas") {
              done();
            }
          }
        );
      });
    });

    describe('Help UT', function () {
      it('Should get the help command', function (done) {
        helpController.command([], 'fr_FR', (message) => {
          if (message.embed.title === "Commande d'aide") {
            done();
          }
        });
      });
    });
  });
});

client.login(dtoken);
