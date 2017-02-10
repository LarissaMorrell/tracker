const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { DATABASE_URL, PORT } = require('./config');
const app = express();
const { User } = require('./models');

app.use(express.static('public'));
app.use(bodyParser.json());
exports.app = app;

mongoose.Promise = global.Promise;


app.get('/user', (req, res) => {
    User
        .find()
        .exec()
        .then(users => {
            res.json(users.map(user => user.apiRepr()));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went terribly wrong' });
        });
});

app.get('/user/:id', (req, res) => {
    User
        .findById(req.params.id)
        .exec()
        .then(user => res.json(user.apiRepr()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' })
        });
});



app.post('/user', (req, res) => {
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'position'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    User
        .create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            phone: req.body.phone,
            position: req.body.position,
            stores: req.body.stores
        })
        .then(
            user => res.status(201).json(user.apiRepr()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
});


app.put('/user/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (
            `Request path id (${req.params.id}) and request body id ` +
            `(${req.body.id}) must match`);
        console.error(message);
        res.status(400).json({ message: message });
    }
    const toUpdate = {};
    const updateableFields = ['firstName', 'lastName', 'email',
        'password', 'address', 'city', 'state', 'zip', 'phone', 
        'position', 'stores'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    User
        .findByIdAndUpdate(req.params.id, { $set: toUpdate })
        .exec()
        .then(user => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});


app.delete('/user/:id', (req, res) => {
  User
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(user => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});


app.use('*', function(req, res) {
    res.status(404).json({ message: 'Not Found' });
});

let server;

// this function connects to our database, then starts the server
function runServer() {
    return new Promise((resolve, reject) => {
        mongoose.connect(DATABASE_URL, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(PORT, () => {
                    console.log(`Your app is listening on port ${PORT}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

// this function closes the server, and returns a promise.
function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

//if server.js is called directly
if (require.main === module) {
    runServer().catch(err => console.error(err));
};

module.exports = { runServer, app, closeServer };
