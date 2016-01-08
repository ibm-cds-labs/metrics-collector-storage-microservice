var async = require('async'),  
   MessageHub = require('message-hub-rest'),
   writer = require('../../lib/writer.js'),
   hub = new MessageHub(JSON.parse(process.env.VCAP_SERVICES)),
   queue_name = process.env.QUEUE_NAME || "mcqueue",
   consumer_name = process.env.CONSUMER_NAME || "consumer",
   consumerInstance = null;
 
console.log("Connecting to Kafka server");  


var collect =  function() {
  
  hub.consume(queue_name, consumer_name, { 'auto.offset.reset': 'smallest' })
    .then(function(data) {
      console.log("Connected",queue_name + "/" + consumer_name)
      consumerInstance = data[0];
    })
    .fail(function(error) {
      console.log("Error", error)
    }); 
  
  async.forever(function(cb) {
    if (consumerInstance) {
      consumerInstance.get(queue_name)
          .then(function(data) {     
              for(var i in data) {
                var obj = JSON.parse(data[i]);
                console.log(obj);
                writer.push(obj, function() { });
              }
              setTimeout(cb,100);
            })
            .fail(function(error) {
              throw new Error(error);
            });
    } else {
      setTimeout(cb,100);
    }
  });
}



module.exports = {
  collect: collect
};