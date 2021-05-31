// CORE MODULES
const express = require("express");
const router = express.Router();

// OUR OWN MODULES - FILES
const User = require("../../models/user");
const Role = require("../../models/role");
const Track = require("../../models/track");
const Course = require("../../models/course");
const Batch = require("../../models/batch");
const Assessment = require("../../models/assessment");
const validators = require("../../validators/validators");
const bcrypt = require('bcrypt');

const UserManager = require("../Managers/userManager");
const BatchManager = require("../Managers/batchManager");
const RoleManager = require("../Managers/roleManager");
// GET LOGIC FOR THE COURSE BEGINS HERE **************************************************

// Get all resources endpoint
router.get("/:object", async (req, res) => {
  if (!global.modelMapper[req.params.object])
    return res.status(404).json({
      code: "not-found",
      message: "The resource request is not found",
    });

  const data = await global.modelMapper[req.params.object].find();
  if (data.length < 1) {
    return res.json({
      code: "success",
      message: "No record found",
    });
  }
  return res.json({
    code: "success",
    message: "request granted",
    result: data,
  });
});

// parameter object will be replaced with users, tracks, courses and assessment
router.post("/:object", async (req, res) => {
  // Check if the request is /users
  if (req.params.object == "user") {
    // Validate the incoming data
    const { error } = await validators.userValidation(req.body);
    if (error) {
      return res.status(400).json({
        code: "invalid-data",
        err: error.message,
      });
    }

    // If email already exists return bad request
    if (await UserManager.getUserByEmail(req.body.email)) {
      return res.status(400).json({
        code: "email-exists",
        message: "Email already exists",
      });
    }

    //If the role doesn't exist return 404 of role doesn't exist
    if (!(await UserManager.getUserRole(req.body.role_type))) {
      return res.status(404).json({
        code: "resource-not-found",
        message: "The specified role is not found",
      });
    }

    // Create a new user with the data from the request body
    const savedUser = await UserManager.createUser({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: bcrypt.hashSync(req.body.password, 10),
      email: req.body.email,
      role_type: req.body.role_type,
      date_created: Date.now(),
    });

    // if it couldnt save return 500 error
    if (!savedUser) {
      return res.status(500).json({
        code: "failed",
        message: "Failed to save data in database",
        error: err,
      });
    }

    // update batch table
    const updatedBatch = await BatchManager.enrollUser(
      req.body.batch_name,
      savedUser._id
    );

    // if updated batch is null return 404 batch not found
    if (!updatedBatch) {
      res.status(404).json({
        code: "batch-not-found",
        message: "batch is not found",
      });
    }

    // If everything saved return 200 success

    return res.json({
      code: "success",
      message: "User created",
      result: {
        id: savedUser.id,
        firstname: savedUser.firstname,
        lastname: savedUser.lastname,
        username: savedUser.username,
        email: savedUser.email,
        role_type: await RoleManager.getUserRoleName(savedUser.role_type),
      },
    });
  }

  //create track route and logic for post method
  else if (req.params.object == "tracks") {
    //validate incomimg data
    const { error } = await validators.trackValidation(req.body);
    if (error) {
      return res.status(400).json({
        code: "invalid-data",
        err: error.message,
      });
    }
    // Check if the track already exist in the database
    const trackNameExists = await Track.findOne({
      track_name: req.body.track_name,
    });

    // If track already exists return bad request
    if (trackNameExists) {
      return res.status(400).json({
        code: "track-exist",
        message: "Track already exists",
      });
    }
    // Create a new track with the data from the request body
    const track = new Track({
      track_name: req.body.track_name,
      track_master: req.body.track_master,
      date_created: Date.now(),
    });

    // Save the track in the database
    track.save((err, track) => {
      if (err) {
        return res.json({
          code: "failed",
          message: "Failed to save track data in database",
          error: err,
        });
      }
      return res.json({
        code: "success",
        message: "Track created",
        result: {
          id: track.id,
          track_name: track.track_name,
          track_master: track.track_master,
          date_created: track.date_created,
        },
      });
    });
  }

  //create batch route and logic for post method
  else if (req.params.object == "batch") {
    // Check if the batch already exist in the database
    const batchNameExists = await Batch.findOne({
      batchname: req.body.batch_name,
    });

    // If batch already exists return bad request
    if (batchNameExists) {
      return res.status(400).json({
        code: "batch-exist",
        message: "Batch already exists",
      });
    }
    // Create a new batch with the data from the request body
    const batch = new Batch({
      batch_name: req.body.batch_name,
      date_created: Date.now(),
    });

    // Save the batch data in the database
    batch.save((err, batch) => {
      if (err) {
        return res.json({
          code: "failed",
          message: "Failed to save batch data in database",
          error: err,
        });
      }
      return res.json({
        code: "success",
        message: "batch created",
        result: {
          batch_name: batch.batchname,
          date_created: batch.date_created,
        },
      });
    });
  }

  // CREATING COURSE LOGIC BEGINS **************************************************************
  // Check if the request is '/course'
  else if (req.params.object == "course") {
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
  }

  // CREATING COURSE LOGIC ENDS HERE **********************************************************

  //create assessment route and logic for post method
  else if (req.params.object == "assessment") {
    //Validate the incoming data
    const { error } = await validators.assessmentValidation(req.body);

    if (error) {
      return res.status(400).json({
        code: "invalid-data",
        err: error.message,
      });
    }

    //Create new assessment with data from req body
    const assessment = new Assessment({
      assessment_type: req.body.assessment_type,
      score: req.body.score,
      course_id: req.body.course_id,
    });

    //save assessment in database
    assessment.save((err, assessment) => {
      if (err) {
        return res.json({
          code: "failed",
          message: "Failed to save assessment data in database",
          error: err,
        });
      }
      return res.json({
        code: "success",
        message: "Assessment created",
        result: assessment,
      });
    });
  }
  
  // If the request parameter <:object> is not any of these resources return 404
  else{
    return res.status(404).json({
      code: "resource-not-found",
      message: "The specified resource is not found"
    })
  } 
});

router.put("/:object/:id", async (req, res) => {
  // logic for updating the various objects will be put here'
  if (!global.modelMapper[req.params.object])
    return res.status(404).json({
      code: "not-found",
      message: "The resource request is not found",
    });

  let object = await global.modelMapper[req.params.object].findById(
    req.params.id
  );

  if (req.params.object == "assessment") {
    //Validate the incoming data
    const { error } = await validators.assessmentValidation(req.body);

    if (error) {
      return res.status(400).json({
        code: "invalid-data",
        err: error.message,
      });
    }
  }
  if (!modelMapper[req.params.object])
    return res.status(404).json({
      code: "not-found",
      message: "The resource request is not found",
    });

  if (req.params.object == "users") {
    // Validate the incoming data
    const { error } = await validators.userValidation(req.body);

    if (error) {
      return res.status(400).json({
        code: "invalid-data",
        err: error.message,
      });
    }
    const role = await Role.findOne({ role_type: req.body.role_type });
    req.body.role_type = role.role_type;
  }

  if (!object)
    return res.status(404).json({
      code: "not-found",
      message: "Resource not found",
    });

  for (const field of Object.keys(req.body)) {
    if (field == "users") {
      object.users.push({
        enrollment_date: Date.now(),
        user_id: req.body.user_id,
      });
    } else if (field == "course_id") {
      object.courses.push({
        enrollment_date: Date.now(),
        course_id: req.body.course_id,
      });
    } else {
      object[field] = req.body[field];
    }
  }
  object.save((err, value) => {
    if (err) {
      return res.status(500).json({
        code: "failed",
        err: "Not able to save in database",
      });
    }
    return res.json(value);
  });
});

// Register a route to delete resources
router.delete("/:object/:id", async (req, res) => {
  const object = await global.modelMapper[req.params.object].findById(
    req.params.id
  );

  if (!object)
    return res.status(404).json({
      code: "not-found",
      message: "Resource not found",
    });

  await global.modelMapper[req.params.object].deleteOne({ _id: req.params.id });

  return res.json({
    code: "success",
    message: "resource deleted",
    result: object,
  });
});

module.exports = router;
