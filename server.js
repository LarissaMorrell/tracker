const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { DATABASE_URL, PORT } = require('./config');
const app = express();
const { User, Store } = require('./models');

app.use(express.static('public'));
app.use(bodyParser.json());


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

app.get('/store', (req, res) => {
    Store
        .find()
        .exec()
        .then(stores => {
            res.json(stores.map(store => store.apiRepr()));
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

app.get('/store/:id', (req, res) => {
    Store
        .findById(req.params.id)
        .exec()
        .then(store => res.json(store.apiRepr()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' })
        });
});







app.post('/user', (req, res) => {
    const requiredFields = ['firstName', 'lastName', 'email', 'password'];
    console.log("request: " + req.body);
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
            store_ids: req.body.store_ids
        })
        .then(
            user => res.status(201).json(user.apiRepr()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
});

app.post('/store', (req, res) => {
    const requiredFields = ['user_assigned_id', 'name'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    Store
        .create({
            user_assigned_id: req.body.user_assigned_id,
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            generalComments: req.body.generalComments,
            tier: req.body.tier,
            personnel: req.body.personnel,
            havePaperwork: req.body.havePaperwork,
            wantPaperworkBack: req.body.wantPaperworkBack,
            lastRedeemed: req.body.lastRedeemed
        })
        .then(
            store => res.status(201).json(store.apiRepr()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
});







app.put('/user/:id', (req, res) => {
    // ensure that the id in the request path and the one in request body match
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (
            `Request path id (${req.params.id}) and request body id ` +
            `(${req.body.id}) must match`);
        console.error(message);
        res.status(400).json({ message: message });
    }

    // we only support a subset of fields being updateable.
    // if the user sent over any of the updatableFields, we udpate those values
    // in document
    const toUpdate = {};
    const updateableFields = ['firstName', 'lastName', 'email', 'password',
        'address', 'city', 'state', 'zip', 'phone', 'company', 'position',
        'store_ids'
    ];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    User
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
        .findByIdAndUpdate(req.params.id, { $set: toUpdate })
        .exec()
        .then(user => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});





app.put('/store/:id', (req, res) => {
    // ensure that the id in the request path and the one in request body match
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (
            `Request path id (${req.params.id}) and request body id ` +
            `(${req.body.id}) must match`);
        console.error(message);
        res.status(400).json({ message: message });
    }

    // we only support a subset of fields being updateable.
    // if the store sent over any of the updatableFields, we udpate those values
    // in document
    const toUpdate = {};
    const updateableFields = ['user_assigned_id', 'name', 'address', 'city',
        'state', 'generalComments', 'tier', 'personnel', 'havePaperwork',
        'wantPaperworkBack', 'lastRedeemed'
    ];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    Store
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
        .findByIdAndUpdate(req.params.id, { $set: toUpdate })
        .exec()
        .then(store => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});





app.delete('/user/:id', (req, res) => {
    User
        .findByIdAndRemove(req.params.id)
        .exec()
        .then(store => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

app.delete('/store/:id', (req, res) => {
    Store
        .findByIdAndRemove(req.params.id)
        .exec()
        .then(store => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
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
