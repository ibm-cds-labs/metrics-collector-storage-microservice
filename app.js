var queue_types = ["redis_queue", "redis_pubsub", "rabbit_queue", "rabbit_pubsub", "kafka"];
var queue_type = "null";
if (queue_types.indexOf(process.env.QUEUE_TYPE) > -1) {
  queue_type = process.env.QUEUE_TYPE;
}
console.log("Queue mode:", queue_type);
var q = require('./plugins/hub/' + queue_type);

q.collect();

//require("cf-deployment-tracker-client").track();