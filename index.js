const yargs = require('yargs');

const commandsConfig = {
    title: {
        describe: 'title of the note',
        demand: true,
        alias: 't',
    },
};

yargs
    .command('add', 'Add a new note', {
        title: commandsConfig.title,
        body: {
            describe: 'body of the note',
            demand: true,
            alias: 'b',
        },
    })
    .command('list', 'list all notes')
    .command('read', 'read an existing note', {
        title: commandsConfig.title,
    })
    .command('remove', 'Delete a single note', {
        title: commandsConfig.title,
    })
    .help();

const commands = require('./notes');

const { title, body } = yargs.argv;

const command = yargs.argv._[0];

try {
    console.log('command result ==>', commands[command](title, body));
} catch (e) {
    console.log(e, 'command not recognized');
}
