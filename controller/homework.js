const HomeworkView = require("../views/homework.js");
const HomeworkModel = require("../models/homework.js");

module.exports = class GmailController {
  constructor(client, con) {
    this.con = con;
    this.client = client;
    var self = this;
    client.on('ready', () => {
      self.view = new HomeworkView(client.user);
    });
    self.model = new HomeworkModel(self.con, () => {
      console.log("[HOMEWORK] MODEL STARTED");
    });
  }

  command(args, callback) {
    if (args.length === 0) {
      this.listHomeworks(callback)
    } else if (args.length === 1) {
      switch (args[0]) {
        case "list":
          this.listHomeworks(callback)
        default:
          break;
      }
    } else if (args.length >= 2) {
      switch (args[0]) {
        case "add":
          this.addHomework(args, callback);
          break;
        case "remove":
          this.removeHomework(args, callback);
          break;
        default:
          break;
      }
    }
  }
  
  addHomework(args, callback) {
    console.log("[HOMEWORK] ADD " + args);
    var dateArray = args[1].split("-"); // Check if item is date
    var date = new Date(2020, dateArray[1] - 1, dateArray[0], 20);
    var subject = args[2];
    var message = args.slice(3).join(" ");
    var self = this;
    this.model.addHomework(date, subject, message, () => {
      self.view.addHomework(args[1], subject, message, callback);
    });
  }

  removeHomework(args, callback) {
    var self = this;
    var id = args[1];
    console.log("[HOMEWORK] REMOVE " + id);
    if (Number.isInteger(parseInt(id))) {
      this.model.removeHomework(id, () => {
        self.view.removeHomework(id, callback);
      });
    } else {
      self.view.printError("Id is not an integer", callback)
    }
  }

  listHomeworks(callback) {
    var self = this;
    console.log("[HOMEWORK] LIST");
    this.model.listHomeworks((data) => {
      self.view.listHomeworks(data, callback)
    })
  }
}
