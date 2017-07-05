var sio = require('socket.io');
var io;
var curNumber = 0;
exports.listen = function(server){
	io = sio.listen(server);
	io.set('log level',1);
	io.sockets.on('connection',function(socket){
		curNumber++;
		socket.on("join",function(name,fn){
			socket.nickname = name;
			fn && fn(curNumber);
			socket.broadcast.emit('announcement',name+'  加入了聊天室',curNumber);
		});
		socket.on("sendmsg",function(sendmsg,fn){
			socket.broadcast.emit('receivemsg',socket.nickname,sendmsg);
			fn(socket.nickname);
		});
		socket.on("disconnect",function(){
			curNumber--;
			socket.broadcast.emit('announcement',socket.nickname+'  退出了聊天室',curNumber);
		});
	});
}