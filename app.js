var fs = require('fs');
var queue_types = fs.readdirSync("./plugins/hub/").map(function(v) { return v.replace(".js","")});
var queue_type = "null";
if (queue_types.indexOf(process.env.QUEUE_TYPE) > -1) {
  queue_type = process.env.QUEUE_TYPE;
}
console.log("Queue mode:", queue_type);
var q = require('./plugins/hub/' + queue_type);

q.collect();

// bluemix kills apps tht don't respond on port 80, so if
// this microservice is to run on Bluemix, it has to look like a web server.
// but when running locally, you can't have two microservices listening on the same
// port so I create a NOLISTEN environment variable which switches that off when running
// locally.
if (!process.env.NOLISTEN) {
  var cfenv = require('cfenv'),
    appEnv = cfenv.getAppEnv(),
    http = require('http');
  http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("I'm alive");
  }).listen(appEnv.port);
  console.log("Listening on", appEnv.port)
}
require("cf-deployment-tracker-client").track();
