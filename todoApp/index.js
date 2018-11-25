import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import { ObjectId } from 'mongodb';

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
	Todo.find().then(result => res.send({ result })).catch(err => res.status(500).send(err));
});

app.get('/todo/:id', (req, res) => {
	const { id } = req.params;
	const errorMessage = 'todo not found';
	Todo.findById(new ObjectId(id)).then((result) => {
		if (result) {
			return res.send({ result });
		}
		return res.status(404).send({ errorMessage });
	}).catch(e => res.send(e));
});

app.get('/user/:id', (req, res) => {
	const { id } = req.params;
	const errorMessage = 'user not found';
	User.findById(new ObjectId(id))
		.then((result) => {
			if (result) {
				return res.send({ result });
			}
			return res.status(404).send({ errorMessage });
		})
		.catch(e => res.status(500).send(e));
});

export const server = app.listen(port, () => console.log(`express init, listening to port ${port}`));
