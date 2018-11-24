import mongoose, { Schema } from 'mongoose';

const StringOptions = {
	type: String,
	trim: true,
};

export const Todo = mongoose.model('Todo', new Schema({
	text: {
		...StringOptions,
		required: true,
	},
	completed: {
		type: Boolean,
		default: false,
	},
	completedAt: {
		type: Date,
		default: null,
	},
}));

export const User = mongoose.model('User', new Schema({
	firstName: {
		...StringOptions,
		required: true,
	},
	lastName: {
		...StringOptions,
		required: true,
	},
	email: {
		...StringOptions,
		required: true,
	},
}));
