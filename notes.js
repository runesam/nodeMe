const fs = require('fs');

let notes = {};

try {
    const notesBlob = fs.readFileSync('notes.json');
    notes = (JSON.parse(notesBlob));
} catch (e) {
    fs.writeFileSync('notes.json', JSON.stringify(notes));
    console.error('creating file ...');
}

function add(title, body) {
    if (notes[title]) {
        return 'a note with that title already exists';
    }
    notes[title] = body;
    fs.writeFileSync('notes.json', JSON.stringify(notes));
    return ({ title, body: notes[title] });
}

function list() {
    return notes;
}

function read(title) {
    if (notes[title]) {
        return ({ title, body: notes[title] });
    }
    return 'a note with that title doesn\'t exist';
}

function remove(title) {
    if (notes[title]) {
        try {
            delete notes[title];
            fs.writeFileSync('notes.json', JSON.stringify(notes));
            return ({ title, body: notes[title] });
        } catch (e) {
            console.error(e);
        }
    }
    return 'a note with that title doesn\'t exist';
}

module.exports = {
    add,
    list,
    read,
    remove,
};
