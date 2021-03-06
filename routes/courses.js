const express = require('express');
const router = express.Router();


const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
];



router.get('/', (request, response) => {
    response.send(courses);

});

router.get('/:id', function (req, res) {
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

router.post('/', function (req, res) {
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

router.put('/:id', function (req, res) {
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

router.delete('/:id', (req, res) => {
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

module.exports = router;