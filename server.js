console.log("Server launched...");

var http = require("http");
var net = require('net');

// On défini le serveur + le port utilisé
httpServer = http.createServer(function(req, result){
	result.end("Forbidden");
});

httpServer.listen(1337);

// On requiere le plugin socket.io et on le relit au serveur
var io = require("socket.io").listen(httpServer);

var users = []; // Variable qui va venir stocker tout les users présents

// On écoute l'événement 'connection' (par défault avec socket.io) qui vient détecter chaque nouvelle connection
io.sockets.on('connection', function(socket) {
	console.log("//      new user       //");

	users.push(socket.id);
	var usersCount = users.length;
	console.log(usersCount);

	//Get last position of the ship
	socket.on("ShipPosition", function(data){
		data.value;

		socket.emit("ShipPosition", data);
	});
	
	// Synchronise en live les déplacements du vaisseau
	socket.on("deplacement", function(data){
		data.value;
		
		io.sockets.emit("deplacement", data);
	});

	io.sockets.emit('playerCount', usersCount);
	

	socket.on("disconnect", function(){
		console.log("//      user disconnected      //");
		var userID = users.indexOf(socket.id);
		users.splice(userID, 1);
		usersCount = users.length;

		io.sockets.emit('playerCount', usersCount);
	});

});
