require('dotenv').config();
//require("../discord.js")({dicord_token: process.env.DISCORD_TOKEN, xbox_key: process.env.XBOX_API_KEY, riotapi: process.env.RIOT_API});
var dtoken = process.env.DISCORD_TOKEN;
var xboxkey = process.env.XBOX_API_KEY;
var riotapi = process.env.RIOT_API;

const Discord = require('discord.js');
const client = new Discord.Client();
const LoLController = require("../controller/lol.js");
const WynncraftController = require("../controller/wynncraft.js");
const assert = require('assert').strict;
const request = require("request");

const WynncraftModel = require("../models/wynncraft.js");
const LoLModel = require("../models/lol.js");
const HivemcModel = require("../models/hivemc.js");
const MojangModel = require("../models/mojang.js");


var lolController, wynncraftController;

describe("Discord tests", function() {
    
    before(function(done){
        client.on('ready', () => {
            client.user.setStatus('visible');
            lolController = new LoLController(client, riotapi);
            wynncraftController = new WynncraftController(client)
            done();
        });
    });

    describe("Models UT", function() {
        describe("League of Legends UT", function() {
            var model = new LoLModel(riotapi);

            it("Should get user statistics", function(done) {
                model.getUserStats({username: "ekazukii"}, (stats) => {
                    if(typeof stats.match !== "undefined") {
                        done();
                    }
                });
            });
    
            it("Should get current champion rotation", function(done) {
                model.getChampionRotation((champList) => {
                    if(champList.length === 15) done();
                });
            });
    
            it("Should compare ekazukii and ObstinateM", function(done) {
                const reducer = (accumulator, currentValue) => accumulator + currentValue;
                model.comparePlayers({user1: "ekazukii", user2: "ObstinateM"}, (stats) => {
                    if(stats.score1.reduce(reducer) > 20 && stats.score2.reduce(reducer) > 20) {
                        done();
                    }
                });
            });
    
            it("Should get user creep score over last 5 games", function(done) {
                lolController.model.getUserCS({username: "ekazukii", ngame: 5}, (stats) => {
                    if(stats.cs.length === 5) {
                        done();
                    }
                });
            });
    
            
        });

        describe("Wynncraft UT", function() {
            var model = new WynncraftModel()
            it("Should get user statistics", function(done) {
                model.getUserStats({username: "zefut"}, (stats) => {
                    if(stats.mobsKilled > 1) {
                        done();
                    }
                });
            });

            it("Should not found the user", function(done) {
                model.getUserStats({username: "IDONTEXIST444552DJJDHDGZ"}, (stats) => {
                    if(stats.error) {
                        done();
                    }
                });
            });
        });
        
        describe("HiveMC UT", function() {
            var model = new HivemcModel();
            it("Should get user statistics", function(done) {
                model.getUserStats({username: "zefut"}, (stats) => {
                    if(stats.hide >= 10) {
                        done();
                    }
                });
            });

            it("Should not found the user", function(done) {
                model.getUserStats({username: "HIVEMCIDONTEXIST444552DJJDHDGZ"}, (stats) => {
                    if(stats.error) {
                        done();
                    }
                });
            });
        });

        describe("Mojang UT", function() {
            var model = new MojangModel();
            it("Should get user statistics", function(done) {
                model.getUUIDByUsername({username: "ekazuki"}, (uuid) => {
                    console.log(uuid)
                    if(uuid === "091c969e-ba6d-4ada-9620-f55038f36e41") {
                        done();
                    }
                });
            });

            it("Should not found the user", function(done) {
                model.getUUIDByUsername({username: "MOJANGCIDONTEXIST444552DJJDHDGZ"}, (stats) => {
                    if(stats.error) {
                        done();
                    }
                });
            });
        });
    });
});


client.login(dtoken)
