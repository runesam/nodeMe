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

const onConnection = (res) => {
	console.log('connected to client', res.id);
};

const onCreateMessage = (data, socket) => {
	const { text } = data;
	const createdAt = new Date();
	const from = socket.id;
	console.log('server got a message', data);
	socket.emit('newMessage', { text, createdAt, from });
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
