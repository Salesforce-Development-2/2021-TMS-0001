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
const courseService = require("../services/courseService");

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


// Register a route to edit course
router.put("/:id", async (req, res) => {

  let error;
  // If request is not coming from an authorized admin reutrn 401
  if (req.user.role.role_title != "admin") {
    return res.status(401).json({
      code: "unathorized",
      message: "User is not allowed to edit a course"
    })
  }
  let updatedCourse;

  if(req.query.enroll){
    updatedCourse = await courseService.enrollUser(req.params.id, req.query.enroll);
    error = updatedCourse.error;
  }
  else if(req.query.unenroll){
    updatedCourse = await courseService.unEnrollUser(req.params.id, req.query.unenroll);
    error = updatedCourse.error;
  }
  else {
      // Validate the incoming data
    error  = await validators.courseValidation(req.body).error;

    // return error if validation fails
    if (error) {
      return res.status(400).json({
        code: "invalid-data",
        err: error.message,
      });
    }
    updatedCourse = await courseService.updateCourse(req.params.id, req.body);

  }

  // If the user is not updated return resource not found
  if(error){
    return res.status(400).json({
      code: "not-found",
      message: "An error occured",
      error: error
    });
  }

  // if successful return 200 with result
  return res.json({
    code: "success",
    message: "Course updated successfully",
    result: updatedCourse
  });
});

// Register a route to get all users
router.get("/", async (req, res) => {
  // If the request is coming from a user access level return 401
  if (req.user.role.role_title != "admin") {
    if (req.params.id != req.user.id) {
      return res.status(401).json({
        code: "unauthorized",
        message: "User is not allowed to get all users"
      })
    }
  }

  // if there users in the query parameters
  // Return the list of tracks the user has been enrolled in
  if(req.query.user){
    const userCourses = await courseService.getUserCourses(req.query.user);
    return res.json({
      code: "success",
      result: userCourses
    })
  }

  // Get all tracks from the database
  const courses = await courseService.getCourses();
  return res.json({
    code: "success",
    result: courses
  })
})

  
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