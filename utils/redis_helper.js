var redis = require('redis');
var config = require('../config');


exports.getClient = function(){
    var options ={connect_timeout:3600000};
    var client = redis.createClient(config.redis_config.port, config.redis_config.host,options);
    if(config.redis_config.auth) {
        client.auth(config.redis_config.auth);
    }
    if(config.redis_config.db) {
        client.select(config.redis_config.db);
    }
    return client;
}

