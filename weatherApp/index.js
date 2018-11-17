import yargs from 'yargs';
import geocode from './geocode';
import forecast from './forecast';

const { argv } = yargs.options({
    address: {
        demand: true,
        alias: 'a',
        describe: 'address to fetch weather for',
        string: true,
    },
}).help().alias('help', 'h');


const { address } = argv;

geocode.geocodeAddress(address).then((result) => {
    console.info(JSON.stringify(result, undefined, 4));
    forecast
        .forecastWeather(result.lat, result.lng)
        .then(res => console.info(JSON.stringify(res, undefined, 4)));
}).catch(error => console.error(error, 'invalid address been provided'));
