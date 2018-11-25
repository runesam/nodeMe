import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';

import { create } from './app';
import { User, Todo } from './models';

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }).then().catch();

// create(User, {
// 	firstName: 'Sam',
// 	lastName: 'Ewdala',
// 	email: 'same7.hamada@gmail.com',
// }).then(res => console.log(res)).catch(e => console.log(e));

export const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/todo', (req, res) => {
	const { text } = req.body;
	create(Todo, { text })
		.then(result => res.send(result))
		.catch(e => res.status(400).send(e));
});

app.get('/todo', (req, res) => {
	Todo.find().then(result => res.send(result)).catch(err => res.status(500).send(err));
});

export const server = app.listen(port, () => console.log(`express init, listening to port ${port}`));
