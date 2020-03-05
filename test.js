const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

//Initiate our app
const app = express();

//Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
router.use(express.static('./routes/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));


//Configure Mongoose
mongoose.connect('mongodb://localhost:32768/passport-tutorial');
mongoose.set('debug', true);

require('./models/Users');
require('./config/passport');
app.use(require('./routes'));


app.listen(3000, () => console.log('Server running on http://localhost:8000/'));
