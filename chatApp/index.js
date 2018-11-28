import path from 'path';
import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

export const app = express();
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

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	onConnection(socket);
	socket.on('disconnect', onDisconnect);
});

// app listening
export default server.listen(
	port, () => console.log(`express init, listening to port ${port}`),
);
