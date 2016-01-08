var redis = require('node-redis'),
  async = require('async'),
  writer = require('../../lib/writer.js'),
  credentials = require('../../lib/bmservice').getCredentials(/^Redis by Compose/) || { username: "", password: "", public_hostname: "localhost/6379"};
  bits = credentials.public_hostname.split('/'),
  hostname = bits[0],
  port = parseInt(bits[1]),
  client = redis.createClient(port, hostname, credentials.password),
  queue_name = process.env.QUEUE_NAME || "mcpubsub";
  
console.log("Connecting to Redis server on", credentials.public_hostname);  

var collect = function() {
  
  client.on("subscribe", function (channel, count) {
    console.log("Subscribed to PubSub channel", queue_name)
  });

  client.on("message", function (channel, message) {
    var obj = JSON.parse(message.toString());
    console.log(obj);
    writer.push(obj, function() {});
  }); 
  
  client.subscribe(queue_name);
}

module.exports = {
  collect: collect
}