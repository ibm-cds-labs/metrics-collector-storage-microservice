var fs = require('fs');
var queue_types = fs.readdirSync("./plugins/hub/").map(function(v) { return v.replace(".js","")});
var queue_type = "null";
if (queue_types.indexOf(process.env.QUEUE_TYPE) > -1) {
  queue_type = process.env.QUEUE_TYPE;
}
console.log("Queue mode:", queue_type);
var q = require('./plugins/hub/' + queue_type);

q.collect();

var cfenv = require('cfenv'),
  appEnv = cfenv.getAppEnv(),
  http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end("I'm alive");
}).listen(appEnv.port);
console.log("Listening on", appEnv.port)

require("cf-deployment-tracker-client").track();
