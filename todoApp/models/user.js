import mongoose, { Schema } from 'mongoose';

const what = 'Todo';

delete mongoose.connection.models[what];

const StringOptions = {
	type: String,
	trim: true,
};

const schema = new Schema({
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
});

export default mongoose.model(what, schema);
