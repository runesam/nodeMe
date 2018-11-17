import Http from 'axios';

const rootURL = 'https://maps.googleapis.com/maps/api/geocode/json';

Http.interceptors.response.use(config => config, error => console.error(
    error.response.status,
    error.response.statusText,
));

const geocodeAddress = address => Http({
    method: 'get',
    url: rootURL,
    params: {
        key: 'AIzaSyBJQXDY16J-MvCy3xaaOarBzJJobbvvpOU',
        address,
    },
}).then((res) => {
    const { geometry: { location: { lat, lng } } } = res.data.results[0];
    return ({
        address: res.data.results[0].formatted_address,
        lat,
        lng,
    });
}).catch(reason => reason);

module.exports = {
    geocodeAddress,
};
