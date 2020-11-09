const fetch = require('node-fetch');
const cheerio = require("cheerio");

/** Model for Overwatch command */
class OWModel {

    constructor() {
        this.platforms = ["pc", "psn", "xbl", "nintendo-switch"];
    }

    /**
     * Fetch information about the user
     * @param {Object} options
     * @param {string} options.username - Overwatch's id
     * @param {string} options.platform - Platform of the user (pc, psn, xbl, nintendo-switch)
     * @param {function(Object)} callback  - Callback statistics to controller list of stats {@link OWView#showUserStats}
     */
    getUserStats(options, callback) {
        var response = {}
        var self = this;
        var id = options.username;
        var platform = options.platform;
        id = id.replace("#", "-");
        if(this.platforms.includes(platform)) {
            platform = platform.replace("switch", "nintendo-switch");
            fetch(`https://playoverwatch.com/en-us/career/${platform}/${id}/`)
                .then(res => res.text())
                .then(body => {
                    const $ = cheerio.load(body);
                    if($("h1").text() !== "Profile Not Found") {
                        if($(".masthead-permission-level-text").text() !== "Private Profile") {
                            response.username = $("h1").first().text();
                            
                            response.gamesPlayed = parseInt( ($("#competitive [data-stat-id=0x0860000000000385] .DataTable-tableColumn").last().text() || 0));
                            response.gamesPlayed = response.gamesPlayed + parseInt(($("#quickplay [data-stat-id=0x0860000000000385] .DataTable-tableColumn").last().text() || 0));

                            response.win = parseInt(($("#competitive [data-stat-id=0x08600000000003F5] .DataTable-tableColumn").last().text() || 0));
                            response.win = response.win + parseInt(($("#quickplay [data-stat-id=0x08600000000003F5] .DataTable-tableColumn").last().text() || 0));
                            
                            response.hours = parseInt(($("#competitive [data-stat-id=0x0860000000000026] .DataTable-tableColumn").last().text() || 0));
                            response.hours = response.hours + parseInt(($("#quickplay [data-stat-id=0x0860000000000026] .DataTable-tableColumn").last().text() || 0));

                            // Winrate % rounded with 2 decimals
                            response.winrate = Math.round((response.win / response.gamesPlayed) * 10000) / 100;                           
                            response.heroes = [];
                            var children = $(".progress-category[data-category-id=0x0860000000000021]").children();
                            if(children.length <= 3) {
                                children.each((i, elem) => {
                                    response.heroes.push({name: $(elem).find(".ProgressBar-title").text(), hours: $(elem).find(".ProgressBar-description").text()});
                                });
                            } else {
                                for (let i = 0; i < 3; i++) {
                                    response.heroes.push({name: children.eq(i).find(".ProgressBar-title").text(), hours: children.eq(i).find(".ProgressBar-description").text()});
                                }
                            }

                            response.ranks = []; 
            
                            // From https://github.com/filp/oversmash/blob/master/lib/scraper.js
                            $(".competitive-rank").first().children().each((i, elem) => {
                                var rank = {};
                                rank.sr = $(elem).find(".competitive-rank-level").text()
                                rank.rankName = self.getRankFromSR(rank.sr);
                                rank.role = $(elem).find(".competitive-rank-tier-tooltip").data("ow-tooltip-text").split(" ")[0]
                                response.ranks.push(rank);
                            });   
                            callback(response);   
                        } else {
                            response.error = true;
                            response.error_desc = "Private profile";
                            callback(response);
                        }
                    } else {
                        response.error = true;
                        response.error_desc = "User not found";
                        callback(response);
                    }
                });
        }
    }

    /**
     * Fetch information about all users named <options.username>
     * @param {Object} options
     * @param {string} options.username - Overwatch's username
     * @param {function(Object)} callback  - Callback statistics to controller list of stats {@link OWView#showSearch}
     */
    searchPublicUsers(options, callback) {
        var username = options.username;
        var response = {users: []}
        var users = [];
        response.more = false;
        fetch(encodeURI(`https://playoverwatch.com/en-us/search/account-by-name/${username}/`))
            .then(res => res.json())
            .then(json => {
                for (let i = 0; i < json.length; i++) {
                    if(json[i].isPublic) {
                        response.users.push(json[i])
                        if(response.users.length > 10) {
                            response.more = true;
                            break;
                        }
                    }
                }

                callback(response)
            });
    }

    /**
     * Get the rank name from the elo of the player
     * @param {number} sr - Skill rank (elo) 
     */
    getRankFromSR(sr) {
        if(sr < 1500) {
            return "Bronze";
        } else if(sr >= 1500 && sr < 2000) {
            return "Silver";
        } else if(sr >= 2000 && sr < 2500) {
            return "Gold";
        } else if(sr >= 2500 && sr < 3000) {
            return "Platinium";
        } else if(sr >= 3000 && sr < 3500) {
            return "Diamond";
        } else if(sr >= 3500 && sr < 4000) {
            return "Master";
        } else if(sr >= 4000) {
            return "Grandmaster";
        }
    }
}

module.exports = OWModel;
