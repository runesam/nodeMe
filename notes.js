function add(title) {
    console.log('adding note', title);
}

function list(title) {
    console.log('listing note', title);
}

function read(title) {
    console.log('reading note', title);
}

function remove(title) {
    console.log('removing note', title);
}

module.exports = {
    add,
    list,
    read,
    remove,
};
