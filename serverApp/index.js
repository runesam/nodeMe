import path from 'path';
import express from 'express';
import hbs from 'hbs';

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
        currentYear: new Date().getUTCFullYear(),
        welcomeMessage: 'welcome to my first node app',
    });
});

app.get('/error', (req, res) => {
    res.status(404);
    res.send({ errorMessage: 'error not found' });
});
app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
        currentYear: new Date().getFullYear(),
    });
});

// INIT
app.listen(port, () => console.log(`express init, listening to port ${port}`));
