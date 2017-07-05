var mysql = require('mysql');
var config = require('../config/db_config');

var pool = mysql.createPool(config.mysql_config);

exports.pool = pool;