const io = global ? global.io : window.io;

if (typeof io === 'function') {
    const socket = io();
    const onConnect = () => {
        console.log('connected to server');
    };
    const onDisconnect = () => {
        console.log('disconnected from server');
    };

    const onNewMessage = (data) => {
        const li = window.document.createElement('li');
        const node = window.document.createTextNode(`${data.from}: ${data.text}`);
        li.appendChild(node);
        window.document.querySelector('ol').appendChild(li);
    };

    window.createMessage = (data) => {
        socket.emit('createMessage', data, (res) => {
            const li = window.document.createElement('li');
            const node = window.document.createTextNode(`me: ${data.text} ${res}`);
            li.appendChild(node);
            window.document.querySelector('ol').appendChild(li);
        });
    };

    window.onSubmit = (e) => {
        e.preventDefault();
        const formData = new window.FormData(e.target);
        const object = {};
        formData.forEach((value, key) => {
            object[key] = value;
        });
        window.createMessage({
            ...object,
            from: 'same7.hamada@gmail.com',
        });
        e.target.reset();
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('newMessage', onNewMessage);
}
