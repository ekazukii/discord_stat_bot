const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const path = require('path');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.resolve(__dirname, './../token.json');

module.exports = class GmailModel {
  constructor(con, callback) {
    this.con = con;
    this.storedId = [];
    var self = this;
    // Load client secrets from a local file.
    fs.readFile(path.resolve(__dirname, './../credentials.json'), (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Gmail API.
      this.authorize(JSON.parse(content), function(auth) {
        self.auth = auth;
        self.gmail = google.gmail({version: 'v1', auth});
        callback();
      });
    });
  }

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  authorize(credentials, callback) {
    var self = this;
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return self.getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  getLastsMessages(callback) {
    var self = this;
    this.gmail.users.messages.list({
      userId: 'me',
      maxResults: 5,
      includeSpamTrash: false
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const messages = res.data.messages;
      var data = [];
      messages.forEach((message) => {
        data.push(message.id)
      });
      callback(data);
    })
  }

  isSender(id, callback) {
    var self = this;
    this.con.query("SELECT email FROM senders", (err, senders, fields) => {
      if (err) {
        console.error(err);
      }
      self.gmail.users.messages.get({
        userId: 'me',
        id: id,
        format: 'metadata'
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        var headers = res.data.payload.headers
        var data = {success: false}
        headers.forEach((header) => {
          if (header.name == 'From') {
            var p1 = header.value.indexOf('<') + 1;
            var p2 = header.value.indexOf('>');
            var email = header.value.substring(p1, p2);
            for (var i = 0; i < senders.length; i++) {
              if (email.toLowerCase() === senders[i].email.toLowerCase()) {
                data.email = email;
                data.success = true;
                self.storedId.push(id);
                self.addToDb(id);
              }
            }
          }
        });
        callback(data)
      });
    });
  }

  isNotRead(id, callback) {
    var con = this.con;
    var bool = false;
    con.query('SELECT 1 FROM mails WHERE mailId = '+con.escape(id), (err, res, fields) => {
      if (err) {
        console.error(err);
      } else {
        if (!res[0]) {
          callback();
          return;
        }
      }
    });
  }

  addToDb(id) {
    var con = this.con;
    con.query("INSERT INTO mails VALUES ("+con.escape(id)+")", (err, res, fields) => {
      if (err) {
        console.error(err);
      }
      console.log(res);
    })
  }

  addToListener(email, callback) {
    var con = this.con;
    con.query("INSERT INTO senders VALUES ("+con.escape(email)+")", (err, res, fields) => {
      if (err) {
        console.error(err);
      }
      callback()
    });
  }

  removeFromListener(email, callback) {
    var con = this.con;
    con.query("DELETE FROM senders WHERE email = "+con.escape(email), (err, res, fields) => {
      if (err) {
        console.error(err);
      }
      callback()
    });
  }

  listSenders(callback) {
    var con = this.con;
    con.query("SELECT * FROM senders", (err, res, fields) => {
      if (err) {
        console.error(err);
      }
      callback(res)
    });
  }
}
