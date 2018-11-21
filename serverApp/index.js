import path from 'path';
import express from 'express';
import hbs from 'hbs';
import fs from 'fs';
import { readings, disagg } from './mock';

hbs.registerPartials(path.join(__dirname, 'views/partials'));
hbs.registerHelper('getCurrentYear', () => new Date().getUTCFullYear());
hbs.registerHelper('getWelcomeMessage', (by, to) => `welcome by ${by} to my first ${to}`);

const app = express();
const port = process.env.PORT || 3000;

// USE
app.use((req, res, next) => {
    const now = new Date().toString();
    const log = `${now}: ${req.method} ~ ${req.url}`;
    fs.appendFile(
        path.join(__dirname, 'server.log'),
        `${log} \n`,
        (err) => {
            if (err) {
                console.log(err, 'can\'t save file');
            }
        },
    );
    console.log(log);
    next();
});
// app.use((req, res) => {
//     res.render('maintenance.hbs', {
//         pageTitle: 'sorry :( we are',
//     });
// });
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
app.get('/meters/:meterId/month/:month', (req, res) => {
    const { month } = req.params;
    const monthReadings = readings(month);
    res.send(monthReadings);
});
app.get('/meters/:meterId/breakdown', (req, res) => {
    const { from, to } = req.query;
    const appliancesBreakdown = disagg(from, to);
    res.send(appliancesBreakdown);
});

app.get('/meters/:meterId/:month', (req, res) => {
    const { month } = req.params;
    if (month === 'latestDay') {
        res.status(404);
        res.send({ errorMessage: 'error not found' });
    }
    const { from, to } = req.query;
    const appliancesBreakdown = disagg(from, to);
    res.send(appliancesBreakdown);
});

// INIT
app.listen(port, () => console.log(`express init, listening to port ${port}`));
