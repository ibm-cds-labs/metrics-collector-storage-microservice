var redis = require('node-redis'),
  async = require('async'),
  writer = require('../../lib/writer.js'),
  credentials = require('../../lib/bmservice').getCredentials(/^Redis by Compose/) || { username: "", password: "", public_hostname: "localhost/6379"};
  bits = credentials.public_hostname.split('/'),
  hostname = bits[0],
  port = parseInt(bits[1]),
  client = redis.createClient(port, hostname, credentials.password),
  queue_name = process.env.QUEUE_NAME || "mcqueue";
  
console.log("Connecting to Redis server on", credentials.public_hostname);  

var collect = function() {
  async.forever(function(cb) {
    // fetch an item from the queue
    client.brpop(queue_name, 0, function(err, buffer) {
      if (err == null && buffer != null) {
        // brpop returns ["mcqueue", "the value"]
        var obj = JSON.parse(buffer[1].toString());
        console.log(obj);
        writer.push(obj, cb)
      } else {
        cb(null);
      }
    });
  });
}

module.exports = {
  collect: collect
}