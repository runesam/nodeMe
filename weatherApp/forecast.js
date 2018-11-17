import Http from 'axios';

const rootURL = 'https://api.darksky.net/forecast/08737b1c1c1226c55f798b08faa273a4';

Http.interceptors.response.use(config => config, error => console.error(
    error.response.status,
    error.response.statusText,
));

const forecastWeather = (latitude, longitude) => Http
    .get(`${rootURL}/${latitude},${longitude}`)
    .then(res => res.data.currently)
    .catch(reason => reason);

module.exports = {
    forecastWeather,
};
