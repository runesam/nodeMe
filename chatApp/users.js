export default class Users {
    constructor() {
        this.users = [];
        this.getUsers = this.getUsers.bind(this);
        this.setUser = this.setUser.bind(this);
        this.getUser = this.getUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.getRoomUsers = this.getRoomUsers.bind(this);
    }

    getUsers() {
        return this.users;
    }

    setUser({ id, username, room }) {
        if (this.getUser({ id })) {
            return { text: 'already exist' };
        }
        const user = { id, username, room };
        this.users.push(user);
        return user;
    }

    getUser({ id }) {
        return this.users.find(user => user.id === id);
    }

    deleteUser(user) {
        const userToDelete = this.getUser(user);
        if (userToDelete) {
            const index = this.users.findIndex(({ id }) => userToDelete.id === id);
            this.users = [...this.users.slice(0, index), ...this.users.slice(index + 1)];
            return userToDelete;
        }
        return { text: 'doesn\'t exist' };
    }

    getRoomUsers(room) {
        return this.users.filter(user => user.room === room);
    }
}
