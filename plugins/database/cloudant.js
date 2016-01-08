
// get Cloudant credentials
var cloudant = null
var db = null;

// instantiate a Cloudant library and create a database.
var connect = function(callback) {
  var DB_NAME = process.env.DB_NAME || "mc";
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
  cloudant = require('cloudant')(service.credentials.url);
  console.log("Connecting to Cloudant service on",service.credentials.host + "/" + DB_NAME);

  // create the database
  cloudant.db.create(DB_NAME, function(err, data) {
    db = cloudant.db.use(DB_NAME);
    callback(null);
  });
};

// write in bulk
var bulkwrite = function(docs, callback) {
  if (db) {
    db.bulk( {docs: docs}, callback)
  } else {
    callback("Not initialised yet", null);
  }
}

module.exports = {
  connect: connect,
  bulkwrite: bulkwrite
}