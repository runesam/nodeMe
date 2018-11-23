import { MongoClient } from 'mongodb';

import { init } from './app';

MongoClient.connect(
    'mongodb://127.0.0.1:27017/TodoApp',
    { useNewUrlParser: true },
    (err, client) => {
        if (err) {
            return console.error('unable to connect to mongodb server', err);
        }
        console.info('connected to mongo db');
        return init(client.db('TodoApp'));
    },
);
