"use strict";
/**
 * A namespace.
 * @namespace Stats
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageEmbed = exports.HivemcStats = exports.WynncraftStats = exports.LoLStats = exports.LoLMasteries = exports.LoLLastMatch = exports.HypyxelStats = exports.CSGOStats = exports.CoCStats = exports.CoCClan = exports.CoCHero = exports.OWSearch = exports.OWStats = exports.OWRank = exports.OWHero = exports.ErrorResponse = void 0;
/**
 * @export
 * @class ErrorResponse
 * @property {boolean} error
 * @property {string} error_desc
 */
var ErrorResponse = /** @class */ (function () {
    function ErrorResponse() {
    }
    return ErrorResponse;
}());
exports.ErrorResponse = ErrorResponse;
//   OVERWATCH TYPES
/**
 *
 * @export
 * @class OWHero
 * @memberof Stats
 * @property {string} name
 * @property {number} hours
 */
var OWHero = /** @class */ (function () {
    function OWHero() {
        this.name = "";
        this.hours = 0;
    }
    return OWHero;
}());
exports.OWHero = OWHero;
/**
 *
 * @export
 * @class OWRank
 * @memberof Stats
 * @property {number} sr
 * @property {string} rankName
 * @property {string} role
 */
var OWRank = /** @class */ (function () {
    function OWRank() {
        this.sr = 0;
        this.rankName = "";
        this.role = "";
    }
    return OWRank;
}());
exports.OWRank = OWRank;
/**
 *
 * @export
 * @class OWStats
 * @memberof Stats
 * @property {string} username
 * @property {number} gamesPlayed
 * @property {number} win
 * @property {number} winrate
 * @property {string} hours
 * @property {Array<OWHero>} heroes
 * @property {Arrat<OWRank>} ranks
 */
var OWStats = /** @class */ (function () {
    function OWStats() {
        this.username = "";
        this.gamesPlayed = 0;
        this.win = 0;
        this.winrate = 0;
        this.hours = 0;
        this.heroes = [];
        this.ranks = undefined;
    }
    return OWStats;
}());
exports.OWStats = OWStats;
/**
 *
 * @export
 * @class OWSearch
 * @memberof Stats
 * @property {Array<Object>} users
 * @property {boolean} more
 * @property {string} username
 */
var OWSearch = /** @class */ (function () {
    function OWSearch() {
        this.users = [];
        this.more = false;
        this.username = "";
    }
    return OWSearch;
}());
exports.OWSearch = OWSearch;
//   CLASH OF CLANS TYPES
/**
 *
 * @export
 * @class CoCHero
 * @memberof Stats
 * @property {string} name
 * @property {string} level
 * @property {number} maxLevel
 */
var CoCHero = /** @class */ (function () {
    function CoCHero() {
        this.name = "";
        this.level = 0;
        this.maxLevel = 0;
    }
    return CoCHero;
}());
exports.CoCHero = CoCHero;
/**
 *
 * @export
 * @class CoCClan
 * @memberof Stats
 * @property {string} name
 * @property {string} tag
 */
var CoCClan = /** @class */ (function () {
    function CoCClan() {
        this.name = "";
        this.tag = "";
    }
    return CoCClan;
}());
exports.CoCClan = CoCClan;
/**
 * Clash of Clans player's stats class
 * @export
 * @class CoCStats
 * @memberof Stats
 * @property {Array<CoCHeero>} heroes
 * @property {number} level
 * @property {CoCClan} clan
 * @property {number} trophies
 * @property {number} townHallLevel
 * @property {string} name
 */
var CoCStats = /** @class */ (function () {
    function CoCStats() {
        this.heroes = undefined;
        this.level = 0;
        this.clan = undefined;
        this.trophies = 0;
        this.townHallLevel = 0;
        this.name = "";
    }
    return CoCStats;
}());
exports.CoCStats = CoCStats;
//   COUNTER STRIKE GLOBAL OFFENSIVE TYPES
/**
 *
 * @export
 * @class CSGOStats
 * @memberof Stats
 * @property {number} win
 * @property {number} lvl
 * @property {number} hd
 * @property {number} hs
 * @property {number} elo
 */
var CSGOStats = /** @class */ (function () {
    function CSGOStats() {
        this.win = 0;
        this.lvl = 0;
        this.kd = 0;
        this.hs = 0;
        this.elo = 0;
    }
    return CSGOStats;
}());
exports.CSGOStats = CSGOStats;
//   HYPIXEL TYPES
/**
 * Array of number of wins in different minigames
 * @typedef WinsArray
 * @type {Array}
 * @property {number} 0 - SkyWars wins
 * @property {number} 1 - BuildBattle wins
 * @property {number} 2 - UHC wins
 * @property {number} 3 - SpeedUHC wins
 * @property {number} 4 - BedWars wins
 */
/**
 *
 * @export
 * @class HypyxelStats
 * @memberof Stats
 * @property {number} win
 * @property {string} rank
 * @property {string} guild
 * @property {boolean} online
 * @property {WinsArray} wins
 * @property {string} username
 */
var HypyxelStats = /** @class */ (function () {
    function HypyxelStats() {
        this.plevel = 0;
        this.rank = undefined;
        this.guild = undefined;
        this.online = false;
        this.wins = [];
        this.username = "";
        this.status = undefined;
    }
    return HypyxelStats;
}());
exports.HypyxelStats = HypyxelStats;
//   LEAGUE OF LEGENDS TYPES
/**
 *
 * @export
 * @class LoLLastMatch
 * @memberof Stats
 * @property {boolean} win
 * @property {number} kills
 * @property {number} deaths
 * @property {number} cs
 * @property {number} assists
 * @property {string} champ
 */
var LoLLastMatch = /** @class */ (function () {
    function LoLLastMatch() {
        this.win = false;
        this.kills = 0;
        this.deaths = 0;
        this.cs = 0;
        this.assists = 0;
        this.champ = "";
    }
    return LoLLastMatch;
}());
exports.LoLLastMatch = LoLLastMatch;
/**
 *
 * @export
 * @class LoLMasteries
 * @memberof Stats
 * @property {number} level
 * @property {number} points
 * @property {string} name
 */
var LoLMasteries = /** @class */ (function () {
    function LoLMasteries() {
        this.level = 0;
        this.points = 0;
        this.name = "";
    }
    return LoLMasteries;
}());
exports.LoLMasteries = LoLMasteries;
/**
 *
 * @export
 * @class LoLStats
 * @memberof Stats
 * @property {string} rank
 * @property {LoLLastMatch} match
 * @property {Array<LoLMasteries>} masteries
 * @property {string} username
 */
var LoLStats = /** @class */ (function () {
    function LoLStats() {
        this.rank = undefined;
        this.match = new LoLLastMatch;
        this.masteries = [];
        this.level = 0;
        this.username = "";
    }
    return LoLStats;
}());
exports.LoLStats = LoLStats;
// WYNNCRAFT STATS
/**
 *
 * @export
 * @class WynncraftStats
 * @memberof Stats
 * @property {string} username
 * @property {number} mobsKilled
 * @property {number} completedQuests
 * @property {number} completedDungeons
 * @property {string} className
 * @property {number} classLevel
 */
var WynncraftStats = /** @class */ (function () {
    function WynncraftStats() {
        this.username = "";
        this.mobsKilled = 0;
        this.completedQuests = 0;
        this.completedDungeons = 0;
        this.className = "";
        this.classLevel = 0;
    }
    return WynncraftStats;
}());
exports.WynncraftStats = WynncraftStats;
//   HIVEMC STATS
/**
 *
 * @export
 * @class HivemcStats
 * @memberof Stats
 * @property {number} hide
 * @property {number} deathrun
 * @property {number} blockparty
 * @property {number} grav
 * @property {string} username
 */
var HivemcStats = /** @class */ (function () {
    function HivemcStats() {
        this.hide = 0;
        this.deathrun = 0;
        this.blockparty = 0;
        this.grav = 0;
        this.username = "";
    }
    return HivemcStats;
}());
exports.HivemcStats = HivemcStats;
//   VIEW TYPES
/**
 *
 * @export
 * @class MessageEmbed
 * @property {Object} embed
 */
var MessageEmbed = /** @class */ (function () {
    function MessageEmbed() {
    }
    return MessageEmbed;
}());
exports.MessageEmbed = MessageEmbed;
