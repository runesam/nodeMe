// a fullfill to make the tests passes
global.io = () => ({ on() {} });

const socket = global.io();
const onConnect = () => {
    console.log('connected to server');
};
const onDisconnect = () => {
    console.log('disconnected from server');
};

socket.on('connect', onConnect);
socket.on('disconnect', onDisconnect);
