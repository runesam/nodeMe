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
    res.send('<style>body{ background: red}</style><h1>hello express</h1>');
});
app.get('/error', (req, res) => {
    res.status(404);
    res.send({ errorMessage: 'error not found' });
});
app.get('/about', (req, res) => {
    res.render('about.hbs');
});

// INIT
app.listen(port, () => console.log(`express init, listening to port ${port}`));
