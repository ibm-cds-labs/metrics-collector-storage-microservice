var elasticsearch = require('elasticsearch');
var client = null;
var DB_NAME = process.env.DB_NAME || "mc";

/*var mappings = {
  mappings: {
    mc: {
      properties: {
        e_c : {
          type: "string",
          index: "not_analyzed" 
        },
        e_a : {
          type: "string",
          index: "not_analyzed" 
        },
        idsite : {
          type: "string",
          index: "not_analyzed" 
        },
        rec : {
          type: "long"
        },
        r : {
          type: "long"
        },
        h : {
          type: "long"
        },
        m : {
          type: "long"
        },
        s : {
          type: "long"
        },
        url : {
          type: "string"
        },
        id : {
          type: "string",
          index: "not_analyzed" 
        },
        idts : {
          type: "date",
          format: "epoch_second"
        },
        idvc : {
          type: "long"
        },
        idvn : {
          type: "long"
        },
        refts : {
          type: "long"
        },
        viewts : {
          type: "date",
          format: "epoch_second"
        },
        cs : {
          type: "string",
          index: "not_analyzed" 
        },
        send_image : {
          type: "long"
        },
        pdf : {
          type: "long"
        },
        qt : {
          type: "long"
        },
        realp : {
          type: "long"
        },
        wma : {
          type: "long"
        },
        dir : {
          type: "long"
        },
        fla : {
          type: "long"
        },
        java : {
          type: "long"
        },
        gears : {
          type: "long"
        },
        ag : {
          type: "long"
        },
        cookie : {
          type: "long"
        },
        res : {
          type: "string",
          index: "not_analyzed" 
        },
        gt_ms : {
          type: "long"
        },
        ip : {
          type: "string",
          index: "not_analyzed" 
        }
      }
    }
  }
};*/


var connect = function(callback) {
  var credentials = require('../../lib/bmservice').getCredentials(/^Elasticsearch by Compose/) || { public_hostname: "localhost/9200", username: "", password: ""};
  var creds = {};
  if (credentials.username && credentials.password) {
    creds.host =  "https://" + credentials.username + ":" + credentials.password + "@" + credentials.public_hostname.replace("/",":");
  } else {
    creds.host = "localhost:9200"
  }
//  creds.log = "trace";
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