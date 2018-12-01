const io = global ? global.io : window.io;

if (typeof io === 'function') {
    const socket = io();

    const callback = ({ error, text, createdAt }) => {
        if (error) {
            // eslint-disable-next-line
            window.alert(text);
            window.location.href = '/';
            return false;
        }
        return window.document.querySelector('.msg_history').insertAdjacentHTML('beforeend', `
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
        const url = new URL(window.document.location.href);
        const username = url.searchParams.get('username');
        const room = url.searchParams.get('room');
        socket.emit('joined', { username, room }, callback);
    };

    const onUpdateUsersList = (users) => {
        const element = window.document.querySelector('.inbox_chat');
        element.innerHTML = '';
        users.forEach(({ username }) => {
            element.insertAdjacentHTML('beforeend', `
                <div class="chat_list active_chat">
                    <div class="chat_people">
                        <div class="chat_img">
                            <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil">
                        </div>
                        <div class="chat_ib">
                            <h5>
                                ${username}
                                <span class="chat_date">
                                    ${window.moment().format('LTS | MMMM d')}
                                </span>
                            </h5>
                            <p>
                            </p>
                        </div>
                    </div>
                </div>
            `);
        });
    };

    const onDisconnect = () => {
        console.log('disconnected from server');
    };

    const onNewMessage = ({ text, from, createdAt }) => {
        window.document.querySelector('.msg_history').insertAdjacentHTML('beforeend', `
            <div class="incoming_msg">
                <div class="incoming_msg_img">
                <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" />
            </div>
            <div class="received_msg">
                <div class="received_withd_msg">
                    <p><b>${from}: </b>${text}</p>
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
    socket.on('updateUsersList', onUpdateUsersList);

    window.document.querySelector('form').addEventListener('submit', onSubmit, false);
    window.document.querySelector('#sendLocation').addEventListener('click', onClick, false);
    window.mdc.textField.MDCTextField.attachTo(
        window.document.querySelector('.mdc-text-field'),
    );
}
