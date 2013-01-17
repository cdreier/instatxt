var io = require('socket.io').listen(1337);


var clients = {};


io.sockets.on('connection', function(socket) {

	io.set('log level', 1);
	
	socket.on("start", function(data){
		if(data.room != socket.room && socket.room != undefined){
			socket.leave(socket.room);
		}
		socket.join(data.room);
		socket.room = data.room;
		socket.broadcast.to(data.room).emit('someoneJoined');
	});
	
	
	socket.on("sync", function(data){
		socket.broadcast.to(data.room).emit('update', {
			txt : data.txt
		});
	});


	
});


