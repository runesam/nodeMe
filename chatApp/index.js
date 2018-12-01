import path from 'path';
import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

import { generateMessage, generateLocationMessage } from './message';
import Users from './users';

const users = new Users();
const app = express();
const publicPath = path.join(__dirname, '/public');
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);

const onDisconnect = ({ id }) => {
	const user = users.deleteUser({ id });
	if (user.id) {
		io.to(user.room).emit('updateUsersList', users.getRoomUsers(user.room));
		io.to(user.room).emit('newMessage', generateMessage(
			'admin',
			`user ${user.username} just leaft the room`,
		));
	}
	console.log(`${id} just got disconnected`);
};

const onJoined = ({ username, room }, callback, socket) => {
	if (username && room) {
		socket.join(room);
		users.deleteUser({ id: socket.id, username, room });
		users.setUser({ id: socket.id, username, room });

		io.to(room).emit('updateUsersList', users.getRoomUsers(room));
		socket.emit('newMessage', generateMessage('admin', 'welcome to the chat app'));
		return socket.broadcast.to(room).emit('newMessage', generateMessage(
			'admin',
			`welcome ${username} he/she just joined the ${room} room`,
		));
	}
	return callback({ error: true, text: 'username and room must be provided' });
};

const onConnection = (socket) => {
	const { id } = socket;
	console.log('connected to client', id);
};

const onCreateMessage = (data, callback, socket) => {
	const { text } = data;
	const { room, username } = users.getUser({ id: socket.id });
	const from = username;
	socket.broadcast.to(room).emit('newMessage', generateMessage(from, text));
	callback({ text, createdAt: new Date() });
	console.log('server got a message', data);
};

const onCreateLocationMessage = (data, callback, socket) => {
	const { latitude, longitude } = data;
	const { room, username } = users.getUser({ id: socket.id });
	const from = username;
	socket.broadcast.to(room).emit('newMessage', generateLocationMessage(from, latitude, longitude));
	callback({ text: `latitude: ${latitude} longitude: ${longitude}`, createdAt: new Date() });
	console.log('server got a message', data);
};

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	onConnection(socket);
	socket.on('disconnect', () => onDisconnect(socket));
	socket.on('createMessage', (data, callback) => onCreateMessage(data, callback, socket));
	socket.on(
		'createLocationMessage',
		(data, callback) => onCreateLocationMessage(data, callback, socket),
	);
	socket.on('joined', (data, callback) => onJoined(data, callback, socket));
});

// app listening
export default server.listen(
	port, () => console.log(`express init, listening to port ${port}`),
);
