var db = require('./database');

function User(){
	
} 

User.prototype.find = function(name,callback){
	var sql ="SELECT * FROM User where name =?";
	db.pool.getConnection(function(err,connection){
		if(err){
			callback && callback(true);
			return;
		}
		connection.query(sql,[name],function(err,result){
			if(err){
				callback && callback();
				return;
			}
			callback && callback(false,result);
		});
	});
};

User.prototype.save =function(array,callback){
	var sql = "insert into USER values(null,?,?,?);";
	db.pool.getConnection(function(err,connection){
		if(err){
			callback && callback(true);
			return;
		}
		connection.query(sql,array,function(err,result){
			if(err){
				callback && callback();
				return;
			}
			callback && callback(false,result);
		})
	});
};
User.prototype.get =function(array,callback){
	var sql = "insert into MyClass values(null,?,?,?)";
	db.pool.getConnection(function(err,connection){
		if(err){
			callback && callback(true);
			return;
		}
		connection.query(sql,array,function(err,result){
			if(err){
				callback && callback();
				return;
			}
			callback && callback(false,result);
		})
	});
}

module.exports = User;