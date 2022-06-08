import fetch from 'node-fetch';
import { ErrorResponse } from '../types';

/** Model of Mojang request */
export class MojangModel {
  constructor() {}

  /**
   * get trimmed UUID of player by his minecraft username
   * @param {string} username - Minecraft username of the player
   * @param {function(string)} callback - Callback the UUID
   */
  getUUIDByUsername(username: string, callback: Function) {
    fetch('https://api.mojang.com/users/profiles/minecraft/' + username, {})
      .then((res: any) => res.json())
      .then((body: any) => {
        callback(
          body.id.substr(0, 8) +
            '-' +
            body.id.substr(8, 4) +
            '-' +
            body.id.substr(12, 4) +
            '-' +
            body.id.substr(16, 4) +
            '-' +
            body.id.substr(20)
        );
      })
      .catch((e: Error) => {
        var response = new ErrorResponse();
        response.error = true;
        response.error_desc = 'user not found';
        callback(response);
      });
  }
}
