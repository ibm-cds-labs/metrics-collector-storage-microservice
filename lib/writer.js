var async = require('async');

// get Cloudant credentials
var services = process.env.VCAP_SERVICES
if (!services) {
  throw("Could not find a VCAP_SERVICES environment variable");
}
var opts = null;

services = JSON.parse(services);
var service = null;
if (!services || !services.cloudantNoSQLDB) {
  throw("Could not find any attached cloudantNoSQLDB services")
}
service = services.cloudantNoSQLDB[0];
var cloudant = require('cloudant')(service.credentials.url);
console.log("Connecting to Cloudant service on",service.credentials.host);
var DB_NAME = process.env.DB_NAME || "mc";
var BUFFER_SIZE = process.env.BUFFER_SIZE || 50;
if (typeof BUFFER_SIZE=="string") BUFFER_SIZE = parseInt(BUFFER_SIZE);
var PARALLELISM = process.env.PARALLELISM || 5;
if (typeof PARALLELISM=="string") PARALLELISM = parseInt(PARALLELISM);
var db = cloudant.db.use(DB_NAME);

// the buffer we use to store items before writing in bulk
var buffer = [];

// create the database
cloudant.db.create(DB_NAME, function(err, data) {
  
});


// process the writes in bulk as a queue
var q = async.queue(function(payload, cb) {
  db.bulk(payload, function(err, data) {
    if (err) {
      console.error("writeerror", err);
    } else {
      console.log("written", { documents: payload.docs.length});
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