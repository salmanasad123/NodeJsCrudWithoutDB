const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('joi');
const express = require('express');
const app = express();
const logging = require("./logger");

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

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
];

app.get('/', (request, response) => {
    response.send("Hello World!");
});

app.get('/api/courses', (request, response) => {
    response.send(courses);

});

app.get('/api/courses/:id', function (req, res) {
    let course = courses.find(function (c) {
        return c.id === parseInt(req.params.id);
    });
    if (!course) {
        res
            .status(404)
            .send("The course with the given id was not found");
    } else {
        res
            .status(200)
            .send(course);
    }

});

app.post('/api/courses', function (req, res) {
    // first we define schema for our course object (how our object is)
    let schema = {
        name: Joi.string().min(3).required()
    };

    let result = Joi.validate(req.body, schema);
    if (result.error) {
        // 400 bad request
        res.status(400).send(result.error.message);
        return;
    }

    let course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', function (req, res) {
    // look up / find the course
    // if doesn't exist return 404
    let course = courses.find(function (c) {
        return c.id === parseInt(req.params.id);
    });
    if (!course) {
        res
            .status(404)
            .send("The course with the given id was not found");
        return;
    }

    // validate the course if found
    // if invalid return 400 bad request
    let result = validateCourse(req.body);
    if (result.error) {
        res.status(400).send(result.error.message);
        return;
    }
    // update the course
    course.name = req.body.name;

    // return updated course
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    // look up / find the course
    // if doesn't exist return 404
    let course = courses.find(function (c) {
        return c.id === parseInt(req.params.id);
    });
    if (!course) {
        res
            .status(404)
            .send("The course with the given id was not found");
        return;
    }
    // if course found
    // delete the course and return deleted course

    let index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);

});


let validateCourse = function (course) {
    let schema = {
        name: Joi.string().min(3).required()
    };
    let result = Joi.validate(course, schema);
    return result;
};


// PORT
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`Listening on port ${port}...`);
});
