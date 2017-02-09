const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {DATABASE_URL, PORT} = require('./config');
const app = express();
const {User} = require('./models');

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
      res.status(500).json({error: 'something went terribly wrong'});
    });
});

app.get('/user/:id', (req, res) => {
  User
    .findById(req.params.id)
    .exec()
    .then(user =>res.json(user.apiRepr()))
    .catch(err => {
      console.error(err);
        res.status(500).json({message: 'Internal server error'})
    });
});



app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
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

module.exports = {runServer, app, closeServer};