const io = global ? global.io : window.io;

if (typeof io === 'function') {
    const socket = io();

    const callback = (message) => {
        const li = window.document.createElement('li');
        const node = window.document.createTextNode(message);
        li.appendChild(node);
        window.document.querySelector('ol').appendChild(li);
    };

    const onConnect = () => {
        console.log('connected to server');
    };

    const onDisconnect = () => {
        console.log('disconnected from server');
    };

    const onNewMessage = ({ text }) => {
        console.log(text);
        window.document.querySelector('ol').insertAdjacentHTML('beforeend', text);
    };

    const createMessage = (data) => {
        socket.emit('createMessage', data, callback);
    };

    const createLocationMessage = ({ coords: { latitude, longitude } }) => {
        socket.emit('createLocationMessage', {
            latitude,
            longitude,
        }, callback);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const formData = new window.FormData(e.target);
        const object = {};
        formData.forEach((value, key) => {
            object[key] = value;
        });
        createMessage(object);
        e.target.reset();
    };

    const onClick = (e) => {
        e.target.disabled = true;
        if (window.navigator.geolocation) {
            return window.navigator.geolocation.getCurrentPosition((position) => {
                console.log(position);
                createLocationMessage(position);
                e.target.disabled = false;
            });
        }
        e.target.disabled = false;
        // eslint-disable-next-line no-alert
        return window.alert('Geolocationis not supported by your browser');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('newMessage', onNewMessage);

    window.document.querySelector('form').addEventListener('submit', onSubmit, false);
    window.document.querySelector('#sendLocation').addEventListener('click', onClick, false);
    window.mdc.textField.MDCTextField.attachTo(
        window.document.querySelector('.mdc-text-field'),
    );
}
