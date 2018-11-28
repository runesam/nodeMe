import path from 'path';
import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

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
	socket.emit('connectWelcome', {
		id,
		from: 'admin',
		text: 'welcome to the chat app',
	});
	socket.broadcast.emit('connectInform', {
		id,
		from: 'admin',
		text: 'new user joined the room',
	});
	console.log('connected to client', id);
};

const onCreateMessage = (data, socket) => {
	const { text } = data;
	const createdAt = new Date().getTime();
	const from = socket.id;
	console.log('server got a message', data);
	socket.broadcast.emit('newMessage', { text, createdAt, from });
};

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	onConnection(socket);
	socket.on('disconnect', onDisconnect);
	socket.on('createMessage', data => onCreateMessage(data, socket));
});

// app listening
export default server.listen(
	port, () => console.log(`express init, listening to port ${port}`),
);
