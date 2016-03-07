
// MongoDB connector
var MongoClient = require('mongodb').MongoClient,
collection = null;


// instantiate a Cloudant library and create a database.
var connect = function(callback) {
  var DB_NAME = process.env.DB_NAME || "mc";
  var credentials = require('../../lib/bmservice').getCredentials(/^MongoDB by Compose/) || { uri: "localhost", username: "", port: 27017};
  var path = "mongodb://" + credentials.uri + ":" + credentials.port + "/" + DB_NAME;
  if (credentials.user && credentials.password) {
    path = path.replace(/\/\//, "//" + credentials.user + ":" + credentials.password + "@");
  }
  path = path + "?ssl=true";
  console.log("Connecting to MongoDB instance on", credentials.uri)
  var options = {
    server: {
      sslValidate: false
    },
    mongos: {
        ssl: true,
        sslValidate: false,
        poolSize: 1,
        reconnectTries: 1
      },
  };
  console.log(path);
  MongoClient.connect(path, options, function(err, db) {
    if (err) {
      throw("Could not connect to MongoDB database",err);
    }  
    console.log("connected to MongoDB")
    collection = db.collection(DB_NAME)
  });
};

// write in bulk
var bulkwrite = function(docs, callback) {
  if (collection) {
    collection.insert(docs, {w:1}, callback)
  } else {
    callback("Not initialised yet", null);
  }
}

module.exports = {
  connect: connect,
  bulkwrite: bulkwrite
}