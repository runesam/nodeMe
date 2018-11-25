import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import { ObjectId } from 'mongodb';

import { create } from './app';
import { User, Todo } from './models';

mongoose.Promise = Promise;
mongoose.connect(
	process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp',
	{ useNewUrlParser: true },
).then().catch();

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
	let errorMessage = 'todo not found';
	if (ObjectId.isValid(id)) {
		return Todo.findById(new ObjectId(id)).then((result) => {
			if (result) {
				return res.send({ result });
			}
			return res.status(404).send({ errorMessage });
		}).catch(e => res.send(e));
	}
	errorMessage = 'invalid ID';
	return res.status(401).send({ errorMessage });
});

app.get('/user/:id', (req, res) => {
	const { id } = req.params;
	let errorMessage = 'user not found';
	if (ObjectId.isValid(id)) {
		return User.findById(new ObjectId(id))
		.then((result) => {
			if (result) {
				return res.send({ result });
			}
			return res.status(404).send({ errorMessage });
		})
		.catch(e => res.status(500).send(e));
	}
	errorMessage = 'invalid ID';
	return res.status(401).send({ errorMessage });
});

export const server = app.listen(port, () => console.log(`express init, listening to port ${port}`));
