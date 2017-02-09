const express = require('express');
const mongoose = require('mongoose');

const {DATABASE_URL, PORT} = require('./config');


const app = express();

app.use(express.static('public'));
app.listen(process.env.PORT || 8080);
exports.app = app;

mongoose.Promise = global.Promise;