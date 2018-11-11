import Http from 'axios';
import yargs from 'yargs';

const { argv } = yargs.options({
    address: {
        demand: true,
        alias: 'a',
        describe: 'address to fetch weather for',
        string: true,
    },
}).help().alias('help', 'h');


const { address } = argv;

const rootURL = 'https://maps.googleapis.com/maps/api/geocode/json';

Http.interceptors.response.use(config => config, error => console.error(
    error.response.status,
    error.response.statusText,
));

Http({
    method: 'get',
    url: rootURL,
    params: {
        key: 'AIzaSyBJQXDY16J-MvCy3xaaOarBzJJobbvvpOU',
        address,
    },
}).then(res => console.log(
    res.data.results[0].formatted_address,
    res.data.results[0].geometry.location.lng,
    res.data.results[0].geometry.location.lat,
)).catch(reason => console.log(reason));
