import path from 'path';
import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

import { generateMessage } from './message';

const app = express();
const publicPath = path.join(__dirname, '/public');
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);

const onDisconnect = (res) => {
	console.log(`${res} just got disconnected`);
};

const onConnection = (socket) => {
	const { id } = socket;
	socket.emit('newMessage', generateMessage('admin', 'welcome to the chat app'));
	socket.broadcast.emit('newMessage', generateMessage(
		'admin',
		`welcome ${id} he/she just joined the room`,
	));
	console.log('connected to client', id);
};

const onCreateMessage = (data, callback, socket) => {
	const { text } = data;
	const from = socket.id;
	socket.broadcast.emit('newMessage', generateMessage(from, text));
	callback('message sent');
	console.log('server got a message', data);
};

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	onConnection(socket);
	socket.on('disconnect', onDisconnect);
	socket.on('createMessage', (data, callback) => onCreateMessage(data, callback, socket));
});

// app listening
export default server.listen(
	port, () => console.log(`express init, listening to port ${port}`),
);
