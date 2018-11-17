import path from 'path';
import express from 'express';
import hbs from 'hbs';

hbs.registerPartials(path.join(__dirname, 'views/partials'));
hbs.registerHelper('getCurrentYear', () => new Date().getUTCFullYear());
hbs.registerHelper('getWelcomeMessage', (by, to) => `welcome by ${by} to my first ${to}`);

const app = express();
const port = 3000;

// USE
app.use(express.static(path.join(__dirname, 'public')));

// SET
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', hbs);

// REST
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'NODE APP',
    });
});

app.get('/error', (req, res) => {
    res.status(404);
    res.send({ errorMessage: 'error not found' });
});
app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
});

// INIT
app.listen(port, () => console.log(`express init, listening to port ${port}`));
