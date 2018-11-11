require('babel-register')({
    presets: ['env'],
});

const yargs = require('yargs');

const { argv } = yargs.options({
    application: {
        demand: true,
        alias: 'app',
        describe: 'application to serve',
        string: true,
    },
}).help().alias('help', 'h');

const { application } = argv;

const path = `./${application}App/index.js`;
module.exports = require(path);
