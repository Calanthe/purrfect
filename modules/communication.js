/* globals exports, require, console */

var _ = require('lodash');
var level = require('./level');
var templates = require('./communication/templates').getRooms();
var rooms = templates.rooms;
var colors = require('colors');
var util = {
	joinRoom: function(socket, newRoom, oldRoom) {
		var newRoomName = newRoom.name;
		var oldRoomName;

		// when toggling the same room go back to lobby
		if (oldRoom && (newRoom.name === oldRoom.name)) {
			newRoom = rooms.lobby;
			newRoomName = newRoom.name;
		}

		socket.set('room', newRoomName);
		socket.join(newRoomName);

		newRoom.playerList[socket.id] = true;
		newRoom.connected = Object.keys(newRoom.playerList).length;

		if (newRoom.connected === 1) {
			// need to generate map
			newRoom.map = JSON.stringify(level.generate());
		}

		if (oldRoom) {
			oldRoomName = oldRoom.name;
			socket.leave(oldRoomName);
			delete oldRoom.playerList[socket.id];
			oldRoom.connected = Object.keys(oldRoom.playerList).length;
		}
	},
	setName: function(socket, name) {
		socket.set('name', name);
	},
	cleanup: function(socket) {
		socket.get('room', function(err, room) {
			if (!err && rooms[room]) {
				rooms[room].playerList = _.without(rooms[room].playerList, socket.id);
				rooms[room].connected = Object.keys(rooms[room].playerList).length;

				if (rooms[room].connected === 0) {
					// clear the map
					delete rooms[room].map;
				}
			} else {
				console.log('something went wrong... chmura is to blame.'.rainbow);
			}
		});
	}
};


exports.onConnection = function(socket, io) {


// join lobby
// emit -> room_list
// on get_room -> room_list
// on set_name -> socket.id -> name
// on join_room ->
	// check if exists
	// check if not full
	// check if in progress
	// check if ready to start -> levelInString = JSON.stringify(level.generate());
// on disconnected -> cleanup

	util.joinRoom(socket, rooms.lobby);

	socket.on('get_room', function() {
		socket.emit('room_list', rooms);
	});
	socket.on('set_name', function(name) {
		util.setName(socket, name);
	});
	socket.on('join_room', function(newRoomName) {
		var newRoomExists = rooms[newRoomName];
		if (newRoomExists) {
			socket.get('room', function(err, oldRoomName) {

				// oldRoomName, newRoomName
				var oldRoom = rooms[oldRoomName];
				var newRoom = rooms[newRoomName];

				var gameInProgress = newRoom.inProgress;
				var canJoin = (newRoom.connected < newRoom.maxPlayers);

				if (canJoin && !gameInProgress) {
					util.joinRoom(socket, newRoom, oldRoom);

					io.sockets.emit('room_list', rooms);
					socket.emit('joined_room', newRoom.map);

					if (newRoom.connected === newRoom.maxPlayers) {
						// prepare to start the game!

						newRoom.inProgress = true;

						io.sockets.in(newRoomName).emit('prepare_to_start');
						setTimeout(function() {
							io.sockets.in(newRoomName).emit('start_the_game');
						}, 5000);
						console.log('** starting a game!'.green);
					}
				} else if (gameInProgress) {
					// game in progress...
					console.log('rejecting user, game in progress'.yellow);
					socket.emit('game_in_progress', {room: newRoomName});
				} else {
					// max users reached...
					console.log('rejecting user, maximum user count reached'.yellow);
					socket.emit('max_users_reached', {room: newRoomName});
				}
			});
		} else {
			socket.emit('error', {details: 'bad room id'});
			console.log('someone tried to do bad thing (bad room id)'.red);
		}
	});
	socket.on('disconnected', function() {
		util.cleanup(socket);
		io.sockets.in('lobby').emit('room_list', rooms);
	});
};