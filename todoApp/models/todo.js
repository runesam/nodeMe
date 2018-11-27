import mongoose, { Schema } from 'mongoose';

const what = 'Todo';

delete mongoose.connection.models[what];

const StringOptions = {
	type: String,
	trim: true,
};

const schema = new Schema({
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
	createdBy: {
		type: Schema.Types.ObjectId,
		required: true,
	},
});

export default mongoose.model(what, schema);
