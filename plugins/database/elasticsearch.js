var elasticsearch = require('elasticsearch');
var client = null;
var DB_NAME = process.env.DB_NAME || "mc";

var connect = function(callback) {
  var credentials = require('../../lib/bmservice').getCredentials(/^Elasticsearch by Compose/) || { public_hostname: "localhost/9200", username: "", password: ""};
  var creds = {};
  if (credentials.username && credentials.password) {
    creds.host =  "https://" + credentials.username + ":" + credentials.password + "@" + credentials.public_hostname.replace("/",":");
  } else {
    creds.host = "localhost:9200"
  }
  client = new elasticsearch.Client(creds);
};

var bulkwrite = function(docs, callback) {
  var commands = []
  for (var i in docs) {
    var command = { index: { _index: DB_NAME, _type: DB_NAME}};
    commands.push(command);
    commands.push(docs[i]);
  }
  client.bulk({body: commands}, callback);
}

module.exports = {
  connect: connect,
  bulkwrite: bulkwrite
}