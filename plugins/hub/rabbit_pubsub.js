var writer = require('../../lib/writer.js'),
  url = process.env.RABBITMQ_URL || 'amqp://localhost',
  safeurl =  url.replace(/:.*@/,":*****@"),
  queue_name = process.env.QUEUE_NAME || "mcpubsub",
  q = null;
  
  
var collect = function() {

  var context = null;
  setInterval(function() {
    if (context === null) {
      context = require('rabbit.js').createContext(url, {"rejectUnauthorized": false});
      context.on('ready', function() {
        var sub = context.socket('SUBSCRIBE');
        sub.on('data', function(payload) { 
          var obj = JSON.parse(payload.toString());
          console.log(JSON.stringify(obj)); 
          writer.push(obj, function() {  });
        });
        sub.connect(queue_name, function(e) {
          console.log("Connected to RabbitMQ -",queue_name);
        });
        
      }).on('error', function(e) {
        console.log("Connection error",e);
        context = null;
      });

    }
  }, 2000);

}


module.exports = {
  collect: collect
}