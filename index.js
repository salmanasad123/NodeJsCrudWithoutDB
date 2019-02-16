const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('joi');
const express = require('express');
const app = express();
const logging = require('./middleware/logger');
const courses = require('./routes/courses');
const home = require('./routes/home');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));  //parses incoming request with url ecoded payload(your data is                                                        send in url encoded form like key=value&key=value... Data is send                                                    in url as key value pairs)
app.use(helmet());
app.use(morgan('tiny'));


// Configuration
console.log("Application name " + config.get('name'));
console.log("Mail Server " + config.get('mail.host'));
console.log("Mail Password " + config.get('mail.password'));


// custom middleware
app.use(logging);

app.use(function (req, res, next) {
    console.log("Authenticating....");
    next();
});

app.use('/api/courses', courses);
app.use('/', home);

// PORT
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`Listening on port ${port}...`);
});
