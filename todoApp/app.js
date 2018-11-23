const dbErrorHandler = error => console.error('DB Error', error);

const dbSuccessHandler = res => console.log(JSON.stringify(res.ops, undefined, 4));

const dbCallback = (err, res) => (err ? dbErrorHandler(err) : dbSuccessHandler(res));

const insertOne = (db, to, that) => db.collection(to).insertOne(that, dbCallback);

const init = (db) => {
    const toInsert = [
        { to: 'Todos', that: { text: 'kill the bitch', completed: false } },
        { to: 'Users', that: { name: 'Sam', age: 29, location: 'Bouchmar Str. Berlin' } },
    ];
    toInsert.forEach(item => insertOne(db, item.to, item.that));
};

module.exports = {
    init,
};
