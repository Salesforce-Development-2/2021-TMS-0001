// CORE MODULES
const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Role = require("../models/role");
const Track = require("../models/track");
const Course = require("../models/course");
const Batch = require("../models/batch");
const Assessment = require("../models/assessment");
const validators = require("../validators/validators");
const bcrypt = require('bcrypt');

// Import services to hanlde database operations
const userService = require("../services/userService");
const batchService = require("../services/batchService");
const roleService = require("../services/roleService");
const trackServie = require("../services/trackService");

router.post('/', async (req, res) =>{
      // Check if the request is '/course'
    // Validate the incoming data for course
    const { error } = await validators.courseValidation(req.body);
    if (error) {
      return res.status(400).json({
        code: "invalid-data",
        err: error.message,
      });
    }
    // Check if the course_name already exist in the database
    const courseNameExists = await Course.findOne({
      course_name: req.body.course_name,
    });

    // If course_name already exists return bad request
    if (courseNameExists) {
      return res.status(400).json({
        code: "course-exist",
        message: "Course already exist",
      });
    }

    // Create a new course with the data from the request body
    const course = new Course({
      course_name: req.body.course_name,
      course_duration: req.body.course_duration,
      course_master: req.body.course_master,
      date_created: Date.now(),
    });

    // Save the course in the database
    course.save((err, course) => {
      if (err) {
        return res.json({
          code: "failed",
          message: "Failed to save data in database",
          error: err,
        });
      }
      return res.json({
        code: "success",
        message: "Course Created",
        result: {
          id: course.id,
          coursename: course.coursename,
          courseduration: course.courseduration,
          coursemaster: course.coursemaster,
          coursetrack: course.coursetrack,
        },
      });
    });
})


router.put("/:id", async (req, res) => {
    let course = await Course.findById(
      req.params.id
    );
  

    if (!course)
      return res.status(404).json({
        code: "not-found",
        message: "The resource request is not found",
      });
  
    for (const field of Object.keys(req.body)) {
      if (field == "users") {
        course.users.push({
          enrollment_date: Date.now(),
          user_id: req.body.user_id,
        });
      }
      else{
        course[field] = req.body[field];
      } 
    }
    course.save((err, value) => {
      if (err) {
        return res.status(500).json({
          code: "failed",
          err: "Not able to save in database",
        });
      }
      return res.json(value);
    });
  });

  
  router.delete("/:id", async (req, res) => {
    const course = await Course.findById(
      req.params.id
    );
  
    if (!course)
      return res.status(404).json({
        code: "not-found",
        message: "Resource not found",
      });
  
    let deletedCourse = await Course.deleteOne({ _id: req.params.id });
  
    return res.json({
      code: "success",
      message: "resource deleted",
      result: deletedCourse,
    });
  });

  module.exports = router;