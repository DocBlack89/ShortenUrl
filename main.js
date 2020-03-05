const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const errorHandler = require('errorhandler');

//Initiate our app
const app = express();

//Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
app.use(express.static('./routes/public')); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('./routes'));


app.listen(3000, () => console.log('Server running on http://localhost:8000/'));
