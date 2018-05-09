const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const APP_PATH = require('./path');
const adapter = new FileSync(APP_PATH.DB_PATH);
const db = low(adapter)

db.defaults({ queue:[],zones:[],logs:[] })
  .write()

module.exports = db;