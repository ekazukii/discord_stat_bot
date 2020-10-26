const request = require('request');

/** Model for Hivemc command */
class HivemcModel {

    constructor() {}

    /**
     * Fetch numbers of wins (in hide&seek, gravity, blockparty and deathrun) of the player
     * @param {Object} options
     * @param {string} options.username - Minecraft username of the player
     * @param {messageCallback} callback - Callback statistics, list of stats {@link HivemcView#showUserStats}
     * @todo Rebuild this method with maybe promises and make request async
     */
    getUserStats(options, callback) {
        var username = options.username;
        var response = {}
        request('http://api.hivemc.com/v1/player/'+username+'/HIDE', { json: true }, (err1, res1, body1) => {
            if (err1) { return console.log(err1); }
            if (typeof body1.code === 'undefined') {
                response.hide = res1.body.victories
                request('http://api.hivemc.com/v1/player/'+username+'/GRAV', { json: true }, (err2, res2, body2) => {
                    if (err2) { return console.log(err2); }
                    response.grav = body2.victories
                    request('http://api.hivemc.com/v1/player/'+username+'/BP', { json: true }, (err3, res3, body3) => {
                        if (err3) { return console.log(err3); }
                        response.blockparty = body3.victories
                        request('http://api.hivemc.com/v1/player/'+username+'/DR', { json: true }, (err4, res4, body4) => {
                            if (err4) { return console.log(err4); }
                            response.deathrun = body4.victories
                            callback(response);
                        });
                    });
                });
            } else {
                response.error = true;
                response.error_desc = "user not found";
                callback(response);
            }
        });
    }
}

module.exports = HivemcModel;
