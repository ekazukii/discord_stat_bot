const GmailView = require("../views/gmail.js");
const GmailModel = require("../models/gmail.js");

module.exports = class GmailController {
  constructor(client, con) {
    this.con = con;
    this.client = client;
    var self = this;
    client.on('ready', () => {
      self.view = new GmailView(client.user);
    });
    self.model = new GmailModel(self.con, () => {
      console.log("Model connected");
    });
  }

  command(args, message, callback) {
    this.message = message
    if (args.length === 0) {
      if(typeof this.interval === "undefined") {
        this.startListener(callback);
      } else {
        this.stopListener(callback);
      }
    } else if (args.length === 1) {
      switch (args[0]) {
        case "start":
          if(typeof this.interval !== "undefined") {
            var data = {error: "Le listener est dejé allumé, $listen stop pour l'arreter"}
            this.view.printError(data, callback)
          } else {
            this.startListener(callback)
          }
          break;
        case "stop":
          if(typeof this.interval === "undefined") {
            var data = {error: "Le listener est dejé stoppé, $listen start pour le lancer"}
            this.view.printError(data, callback)
          } else {
            this.stopListener(callback)
          }
          break;
        case "list":
          this.listSenders(callback)
        default:
          break;
      }
    } else if (args.length === 2) {
      switch (args[0]) {
        case "add":
          this.addToListener(args[1], callback);
          break;
        case "remove":
          this.removeFromListener(args[1], callback);
          break;
        default:
          break;

      }
    }
  }

  startListener(callback) {
    var self = this;
    self.interval = setInterval(() => {
      self.checkMails()
    }, 60000);
    console.log("[INFO] Un listener a start");
    self.view.startListener(callback);
  }

  stopListener(callback) {
    clearInterval(this.interval);
    this.interval = undefined;
    console.log("[INFO] Un listener a stop");
    this.view.stopListener(callback);
  }

  checkMails() {
    console.log("[INFO] Les mails ont été checks");
    var self = this;
    // Get 5 last messages
    self.model.getLastsMessages((messagesId) => {
      // Loop last 5 messages
      messagesId.forEach((id) => {
        // If  mail already noticed
        self.model.isNotRead(id, () => {
          // Check if mail is in authors Watchlist
          self.model.isSender(id, (data) => {
            // Check if data true
            if (data.success) {
              console.log("[INFO] Un nouveau mail du listener");
              // Generate view
              self.view.emailsMatch(data, (embed) => {
                // Send view to channel
                self.message.channel.send(embed)
              })
            }
          })
        })
      });
    })
  }

  addToListener(email, callback) {
    var self = this;
    this.model.addToListener(email, () => {
      self.view.addToListener(email, callback);
    });
  }

  removeFromListener(email, callback) {
    var self = this;
    this.model.removeFromListener(email, () => {
      self.view.removeFromListener(email, callback);
    });
  }

  listSenders(callback) {
    var self = this;
    this.model.listSenders((data) => {
      self.view.listSenders(data, callback)
    })
  }
}
