module.exports = class HomeworkModel {
  constructor(con, callback) {
    this.con = con;
    callback();
  }

  addHomework(date, subject, message, callback) {
    var con = this.con;
    con.query("INSERT INTO devoirs (date, subject, description) VALUES ("+con.escape(date)+", "+con.escape(subject)+", "+con.escape(message)+")", (err, res, fields) => {
      if (err) {
        console.error(err);
      }
      callback()
    });
  }

  removeHomework(id, callback) {
    var con = this.con;
    con.query("DELETE FROM devoirs WHERE id = "+con.escape(id), (err, res, fields) => {
      if (err) {
        console.error(err);
      }
      callback()
    });
  }

  listHomeworks(callback) {
    var con = this.con;
    con.query("SELECT * FROM devoirs", (err, res, fields) => {
      if (err) {
        console.error(err);
      }
      callback(res);
    });
  }
}
