const io = global ? global.io : window.io;

if (typeof io === 'function') {
    const socket = io();

    const callback = ({ text, createdAt }) => {
        window.document.querySelector('.msg_history').insertAdjacentHTML('beforeend', `
            <div class="outgoing_msg">
                <div class="sent_msg">
                    <p>${text}</p>
                    <span class="time_date">
                        ${window.moment(createdAt).format('LTS | MMMM d')}
                    </span>
                </div>
            </div>
        `);
    };

    const onConnect = () => {
        console.log('connected to server');
    };

    const onDisconnect = () => {
        console.log('disconnected from server');
    };

    const onNewMessage = ({ text, createdAt }) => {
        window.document.querySelector('.msg_history').insertAdjacentHTML('beforeend', `
            <div class="incoming_msg">
                <div class="incoming_msg_img">
                <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" />
            </div>
            <div class="received_msg">
                <div class="received_withd_msg">
                    <p>${text}</p>
                    <span class="time_date">
                        ${window.moment(createdAt).format('LTS | MMMM d')}
                    </span>
                </div>
            </div>
        `);
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
