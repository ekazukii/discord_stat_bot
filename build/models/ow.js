"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OWModel = void 0;
// @ts-ignore
var fetch = require("node-fetch");
var types = require("../types");
var cheerio = require("cheerio");
/** Model for Overwatch command */
var OWModel = /** @class */ (function () {
    function OWModel() {
        this.platforms = ["pc", "psn", "xbl", "nintendo-switch"];
    }
    /**
     * Fetch information about the user
     * @param {Object} options
     * @param {string} options.username - Overwatch's id
     * @param {string} options.platform - Platform of the user (pc, psn, xbl, nintendo-switch)
     * @param {function(Object)} callback  - Callback statistics to controller list of stats {@link OWView#showUserStats}
     */
    OWModel.prototype.getUserStats = function (options, callback) {
        var self = this;
        var id = options.username;
        var platform = options.platform;
        id = id.replace("#", "-");
        if (this.platforms.includes(platform)) {
            platform = platform.replace("switch", "nintendo-switch");
            fetch("https://playoverwatch.com/en-us/career/" + platform + "/" + id + "/", {})
                .then(function (res) { return res.text(); })
                .then(function (body) {
                var $ = cheerio.load(body);
                if ($("h1").text() !== "Profile Not Found") {
                    if ($(".masthead-permission-level-text").text() !== "Private Profile") {
                        var response = new types.OWStats;
                        response.username = $("h1").first().text();
                        response.gamesPlayed = parseInt(($("#competitive [data-stat-id=0x0860000000000385] .DataTable-tableColumn").last().text() || 0));
                        response.gamesPlayed = response.gamesPlayed + parseInt(($("#quickplay [data-stat-id=0x0860000000000385] .DataTable-tableColumn").last().text() || 0));
                        response.win = parseInt(($("#competitive [data-stat-id=0x08600000000003F5] .DataTable-tableColumn").last().text() || 0));
                        response.win = response.win + parseInt(($("#quickplay [data-stat-id=0x08600000000003F5] .DataTable-tableColumn").last().text() || 0));
                        response.hours = parseInt(($("#competitive [data-stat-id=0x0860000000000026] .DataTable-tableColumn").last().text() || 0));
                        response.hours = response.hours + parseInt(($("#quickplay [data-stat-id=0x0860000000000026] .DataTable-tableColumn").last().text() || 0));
                        // Winrate % rounded with 2 decimals
                        response.winrate = Math.round((response.win / response.gamesPlayed) * 10000) / 100;
                        response.heroes = [];
                        var children = $(".progress-category[data-category-id=0x0860000000000021]").children();
                        if (children.length <= 3) {
                            children.each(function (i, elem) {
                                response.heroes.push({ name: $(elem).find(".ProgressBar-title").text(), hours: $(elem).find(".ProgressBar-description").text() });
                            });
                        }
                        else {
                            for (var i = 0; i < 3; i++) {
                                response.heroes.push({ name: children.eq(i).find(".ProgressBar-title").text(), hours: children.eq(i).find(".ProgressBar-description").text() });
                            }
                        }
                        response.ranks = [];
                        // From https://github.com/filp/oversmash/blob/master/lib/scraper.js
                        $(".competitive-rank").first().children().each(function (i, elem) {
                            var rank = new types.OWRank;
                            rank.sr = $(elem).find(".competitive-rank-level").text();
                            rank.rankName = self.getRankFromSR(rank.sr);
                            rank.role = $(elem).find(".competitive-rank-tier-tooltip").data("ow-tooltip-text").split(" ")[0];
                            response.ranks.push(rank);
                        });
                        callback(response);
                    }
                    else {
                        var errRes = new types.ErrorResponse;
                        errRes.error = true;
                        errRes.error_desc = "Private profile";
                        callback(errRes);
                    }
                }
                else {
                    var errRes = new types.ErrorResponse;
                    errRes.error = true;
                    errRes.error_desc = "User not found";
                    callback(errRes);
                }
            });
        }
    };
    /**
     * Fetch information about all users named <options.username>
     * @param {Object} options
     * @param {string} options.username - Overwatch's username
     * @param {function(Object)} callback  - Callback statistics to controller list of stats {@link OWView#showSearch}
     */
    OWModel.prototype.searchPublicUsers = function (options, callback) {
        var username = options.username;
        var response = new types.OWSearch;
        var users = [];
        response.more = false;
        fetch(encodeURI("https://playoverwatch.com/en-us/search/account-by-name/" + username + "/"), {})
            .then(function (res) { return res.json(); })
            .then(function (json) {
            for (var i = 0; i < json.length; i++) {
                if (json[i].isPublic) {
                    response.users.push(json[i]);
                    if (response.users.length > 10) {
                        response.more = true;
                        break;
                    }
                }
            }
            callback(response);
        });
    };
    /**
     * Get the rank name from the elo of the player
     * @param {number} sr - Skill rank (elo)
     */
    OWModel.prototype.getRankFromSR = function (sr) {
        if (sr < 1500) {
            return "Bronze";
        }
        else if (sr >= 1500 && sr < 2000) {
            return "Silver";
        }
        else if (sr >= 2000 && sr < 2500) {
            return "Gold";
        }
        else if (sr >= 2500 && sr < 3000) {
            return "Platinium";
        }
        else if (sr >= 3000 && sr < 3500) {
            return "Diamond";
        }
        else if (sr >= 3500 && sr < 4000) {
            return "Master";
        }
        else if (sr >= 4000) {
            return "Grandmaster";
        }
    };
    return OWModel;
}());
exports.OWModel = OWModel;
