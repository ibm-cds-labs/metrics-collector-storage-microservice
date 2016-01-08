var async = require('async'),
  total = 0;

// load the database plugin
var database_types = ["stdout", "cloudant", "mongodb"];
var database_type = "stdout";
if (database_types.indexOf(process.env.DATABASE_TYPE) > -1) {
  database_type = process.env.DATABASE_TYPE;
}
console.log("Database mode:", database_type);
var database = require('../plugins/database/' + database_type);

// initialise the database
database.connect(function() {});
  
// get other config from environment variables
var BUFFER_SIZE = process.env.BUFFER_SIZE || 50;
if (typeof BUFFER_SIZE=="string") BUFFER_SIZE = parseInt(BUFFER_SIZE);
var PARALLELISM = process.env.PARALLELISM || 5;
if (typeof PARALLELISM=="string") PARALLELISM = parseInt(PARALLELISM);

// the buffer we use to store items before writing in bulk
var buffer = [];


// process the writes in bulk as a queue
var q = async.queue(function(payload, cb) {
  database.bulkwrite(payload.docs, function(err, data) {
    if (err) {
      console.error("writeerror", err);
    } else {
      total += payload.docs.length;
      console.log("written", { documents: payload.docs.length, total: total});
    }
    cb();
  });
}, PARALLELISM);

// write the contents of the buffer to CouchDB in blocks of BUFFER_SIZE
var processBuffer = function(flush, callback) {

  if(flush || buffer.length>= BUFFER_SIZE) {
    var toSend = buffer.splice(0, buffer.length);
    buffer = [];
    q.push({docs: toSend});
    callback();    
  } else {
    callback();
  }
}

var push = function(obj, callback) {
  buffer.push(obj);
  processBuffer(false, function() {
    callback(null);
  });
}

// flush the buffer every ten seconds
setInterval(function() {
  if (buffer.length>0) {
    processBuffer(true, function() {});
  }
}, 1000 * 10)

module.exports = {
  push: push
}