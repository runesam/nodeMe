const { argv } = require('yargs');

const commands = require('./notes');

const args = argv;

const command = args._[0];

try {
    commands[command](args.title);
} catch (e) {
    console.log(e, 'command not recognized');
}
