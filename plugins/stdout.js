
// do nothing database driver

var connect = function(callback) {
  callback(null);
};

var bulkwrite = function(docs, callback) {
  callback(null);
}

module.exports = {
  connect: connect,
  bulkwrite: bulkwrite
}