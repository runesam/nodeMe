import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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
	if (this.isModified('password') && this.password) {
		bcrypt.hash(this.password, 10, (err, hash) => {
			this.password = hash;
			next(err);
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

schema.statics.removeToken = function removeToken(token) {
	const user = this;
	return user.update({
		$pull: {
			tokens: { token },
		},
	});
};

schema.statics.findByEmailAndPassword = function findByEmailAndPassword(email, agentPassword) {
	return this.findOne({ email }).then((user) => {
		let message = { errorMessage: 'wrong email or password' };
		if (user) {
			const { password } = user;
			return bcrypt.compare(agentPassword, password).then((res) => {
				if (res) {
					return user;
				}
				message = { ...message, status: 401 };
				throw message;
			}).catch(error => (error));
		}
		message = { ...message, status: 404 };
		throw message;
	}, error => error);
};

schema.methods.toJSON = function toJSON() {
	const { email, _id, tokens } = this.toObject();
	return ({ email, _id, tokens });
};

schema.methods.generateAuthToken = function generateAuthToken() {
	const { _id } = this;
	const access = 'auth';
	const token = jwt.sign({ _id: _id.toHexString(), access }, 'secret').toString();
	this.tokens = [...this.tokens, { access, token }];
	return this.save().then(() => token);
};


export default mongoose.model(what, schema);
