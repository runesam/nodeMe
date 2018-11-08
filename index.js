const { argv } = require('yargs');

const commands = require('./notes');

const { title, body } = argv;

const command = argv._[0];

try {
    console.log('command result ==>', commands[command](title, body));
} catch (e) {
    console.log(e, 'command not recognized');
}
