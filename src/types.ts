/**
 * @export
 * @class ErrorResponse
 * @property {boolean} error
 * @property {string} error_desc
 */
export class ErrorResponse {
    error: boolean;
    error_desc: string;
}

//   OVERWATCH TYPES

/**
 *
 * @export
 * @class OWHero
 * @property {string} name
 * @property {number} hours
 */
export class OWHero {
    name: string = "";
    hours: number = 0;
}

/**
 *
 * @export
 * @class OWRank
 * @property {number} sr
 * @property {string} rankName
 * @property {string} role
 */
export class OWRank {
    sr: number = 0;
    rankName: string = "";
    role: string = "";
}

/**
 *
 * @export
 * @class OWStats
 * @property {string} username
 * @property {number} gamesPlayed
 * @property {number} win
 * @property {number} winrate
 * @property {string} hours
 * @property {Array<OWHero>} heroes
 * @property {Arrat<OWRank>} ranks
 */
export class OWStats {
    username: string = "";
    gamesPlayed: number = 0;
    win: number = 0;
    winrate: number = 0;
    hours: number = 0;
    heroes: Array<OWHero> = [];
    ranks: Array<OWRank> = undefined;
}

/**
 *
 * @export
 * @class OWSearch
 * @property {Array<Object>} users
 * @property {boolean} more
 * @property {string} username
 */
export class OWSearch {
    users: Array<any> = [];
    more: boolean = false;
    username: string = "";
}

//   CLASH OF CLANS TYPES

/**
 *
 * @export
 * @class CoCHero
 * @property {string} name
 * @property {string} level
 * @property {number} maxLevel
 */
export class CoCHero {
    name: string = "";
    level: number = 0;
    maxLevel: number = 0;
}

/**
 *
 * @export
 * @class CoCClan
 * @property {string} name
 * @property {string} tag
 */
export class CoCClan {
    name: string = "";
    tag: string = "";
}

/**
 * Clash of Clans player's stats class
 * @export
 * @class CoCStats
 * @property {Array<CoCHeero>} heroes
 * @property {number} level
 * @property {CoCClan} clan
 * @property {number} trophies
 * @property {number} townHallLevel
 * @property {string} name
 */
export class CoCStats {
    heroes: Array<CoCHero> = undefined;
    level: number = 0;
    clan: CoCClan = undefined;
    trophies: number = 0;
    townHallLevel: number = 0;
    name: string = "";
}

//   COUNTER STRIKE GLOBAL OFFENSIVE TYPES

/**
 *
 * @export
 * @class CSGOStats
 * @property {number} win
 * @property {number} lvl
 * @property {number} hd
 * @property {number} hs
 * @property {number} elo
 * @property {string} username
 */
export class CSGOStats {
    win: number = 0;
    lvl: number = 0;
    kd: number = 0;
    hs: number = 0;
    elo: number = 0;
    username: string = "";
}

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
 * @property {number} win
 * @property {string} rank
 * @property {string} guild
 * @property {boolean} online
 * @property {WinsArray} wins
 * @property {string} username 
 */
export class HypyxelStats {
    plevel: number = 0;
    rank: string = undefined;
    guild: string = undefined;
    online: boolean = false;
    wins: any[] = [];
    username: string = "";
    status: boolean = undefined;
}

//   LEAGUE OF LEGENDS TYPES

/**
 *
 * @export
 * @class LoLLastMatch
 * @property {boolean} win
 * @property {number} kills
 * @property {number} deaths
 * @property {number} cs
 * @property {number} assists
 * @property {string} champ
 */
export class LoLLastMatch {
    win: boolean = false;
    kills: number  = 0;
    deaths: number = 0;
    cs: number = 0;
    assists: number = 0;
    champ: string = "";
}

/**
 *
 * @export
 * @class LoLMasteries
 * @property {number} level
 * @property {number} points
 * @property {string} name
 */
export class LoLMasteries {
    level: number = 0;
    points: number = 0;
    name: string = "";
}

/**
 *
 * @export
 * @class LoLStats
 * @property {string} rank
 * @property {LoLLastMatch} match
 * @property {Array<LoLMasteries>} masteries
 * @property {string} username
 */
export class LoLStats  {
    rank: string = undefined;
    match: LoLLastMatch = new LoLLastMatch;
    masteries: Array<LoLMasteries> = [];
    level: number = 0;
    username: string = "";
}

// WYNNCRAFT STATS

/**
 *
 * @export
 * @class WynncraftStats
 * 
 * @property {string} username
 * @property {number} mobsKilled
 * @property {number} completedQuests
 * @property {number} completedDungeons
 * @property {string} className
 * @property {number} classLevel
 */
export class WynncraftStats {
    username: string = "";
    mobsKilled: number = 0;
    completedQuests: number = 0;
    completedDungeons: number = 0;
    className: string = "";
    classLevel: number = 0;

}

//   HIVEMC STATS

/**
 *
 * @export
 * @class HivemcStats
 * @property {number} hide
 * @property {number} deathrun
 * @property {number} blockparty
 * @property {number} grav
 * @property {string} username 
 */
export class HivemcStats {
    hide: number = 0;
    deathrun: number = 0;
    blockparty: number = 0;
    grav: number = 0;
    username: string = "";
}

//   VIEW TYPES
/**
 *
 * @export
 * @class MessageEmbed
 * @property {Object} embed
 */
export class MessageEmbed {
    embed: any;
}