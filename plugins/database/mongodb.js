
// MongoDB connector
var MongoClient = require('mongodb').MongoClient,
collection = null;


// instantiate a Cloudant library and create a database.
var connect = function(callback) {
  var DB_NAME = process.env.DB_NAME || "mc";
  var credentials = require('../../lib/bmservice').getCredentials(/^MongoDB by Compose/) || { uri: "localhost", username: "", port: 27017};
  var path = "mongodb://" + credentials.uri + ":" + credentials.port + "/" + DB_NAME;
  if (credentials.username && credentials.password) {
    path = path.replace(/\/\//, "//" + credentials.username + ":" + credentials.password);
  }
  MongoClient.connect(path, function(err, db) {
    if (err) {
      throw("Could not connect to MongoDB database");
    }  
    collection = db.collection(DB_NAME)
  });
};

// write in bulk
var bulkwrite = function(docs, callback) {
  // keys starting with $ are not allowed in MongoDB
  for (var i in docs) {
    for (var j in docs[i]) {
      if ( docs[i][j].match(/^\$/)) {
        delete docs[i][j];
      }
    }
  }
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