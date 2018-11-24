require('babel-register')({
    presets: ['env'],
	plugins: ['transform-object-rest-spread'],
});

const yArgs = require('yargs');

if (!yArgs.options) {
	yArgs.options = () => {};
}

const { argv } = yArgs.options({
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
