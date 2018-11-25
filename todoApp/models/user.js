import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bycrypt from 'bcrypt';

const what = 'User';

delete mongoose.connection.models[what];

const StringOptions = {
	type: String,
	trim: true,
	required: true,
};

const schema = new Schema({
	email: {
		...StringOptions,
		required: [true, 'User email is required'],
		unique: true,
		validate: {
			validator(v) {
				return /\S+@\S+\.\S+/.test(v.toLowerCase());
			},
			message: props => `${props.value} is not a valid email!`,
		},
	},
	password: {
		...StringOptions,
		minlength: 6,
	},
	tokens: [{
		access: {
			...StringOptions,
		},
		token: {
			...StringOptions,
		},
	}],
});

schema.pre('save', function beforeSave(next) {
	if (this.password) {
		bycrypt.genSalt(10, (err, salt) => {
			bycrypt.hash(this.password, salt, (error, hash) => {
				this.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

schema.statics.findByToken = function findByToken(token) {
	const User = this;
	try {
		const { _id } = jwt.verify(token, 'secret');
		return User.findOne({ _id, 'tokens.token': token, 'tokens.access': 'auth' });
	} catch (e) {
		return Promise.reject(e);
	}
};

schema.methods.toJSON = function toJSON() {
	const { email, _id } = this.toObject();
	return ({ email, _id });
};

schema.methods.generateAuthToken = function generateAuthToken() {
	const { _id } = this;
	const access = 'auth';
	const token = jwt.sign({ _id: _id.toHexString(), access }, 'secret').toString();
	this.tokens = [...this.tokens, { access, token }];
	return this.save().then(() => token);
};


export default mongoose.model(what, schema);
