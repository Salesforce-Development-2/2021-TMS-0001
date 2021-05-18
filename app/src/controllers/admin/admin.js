// CORE MODULES
const express = require("express");
const router = express.Router();

// OUR OWN MODULES - FILES
const User = require("../../models/user");
const Role = require("../../models/role");
const Action = require("../../models/actions");
const actions = require("../../models/actions");
const Track = require("../../models/track");
const Course = require("../../models/course");

router.get("/:object", (req, res) => {
  res.send("welcome");
  // logic for updating the various objects will be put here
});

// parameter object will be replaced with users, tracks, courses and assessment
router.post("/:object", async (req, res) => {
  // Check if the request is /users
  if (req.params.object == "user") {
    // Check if the email already exist in the database
    const emailExists = await User.findOne({ email: req.body.email });

    // If email already exists return bad request
    if (emailExists) {
      return res.status(400).json({
        code: "email-exists",
        message: "Email already exists",
      });
    }

    // Find the type of role with the role_type specified in the request body
    Role.findOne({ role_type: req.body.role_type }, (err, role) => {
      //If the role doesn't exist return 404 of role doesn't exist
      if (!role) {
        return res.status(404).json({
          code: "resource-not-found",
          message: "The specified role is not found",
        });
      }

      // Create a new user with the data from the request body
      const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
        username: req.body.username,
        email: req.body.email,
        role_type: role.id,
        date_created: Date.now(),
      });

      // Save the user in the database
      user.save((err, user) => {
        if (err) {
          return res.json({
            code: "failed",
            message: "Failed to save data in database",
            error: err,
          });
        }
        return res.json({
          code: "success",
          message: "User created",
          result: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            email: user.email,
            role_type: user.role_type,
          },
        });
      });
    });
  }

  //create track route and logic for post method
  // n
  if (req.params.object == "tracks") {
    // Check if the track already exist in the database
    const trackNameExists = await Track.findOne({ trackname: req.body.email });

    // If track already exists return bad request
    if (trackNameExists) {
      return res.status(400).json({
        code: "track-exist",
        message: "Track already exists",
      });
    }


    //create track route and logic for post method
    // n
    if(req.params.object == 'tracks'){

        // Check if the track already exist in the database
        const trackNameExists = await Track.findOne({"trackname": req.body.email})

        // If track already exists return bad request
        if(trackNameExists){
            return res.status(400).json({
                code: "track-exist",
                message: "Track already exists"
            })
        }
         // Create a new track with the data from the request body 
         const track = new Track({
            trackname: req.body.trackname,
            trackmaster: req.body.trackmaster,
            date_created: Date.now(),
        })

        // Save the track in the database
        track.save((err, track) =>{
            if(err){
                return res.json({
                    code: "failed",
                    message: "Failed to save track data in database",
                    error : err
                })
            }
            return res.json({
                code: "success",
                message: "Track created",
                result: {
                    id: track.id,
                    trackname: track.trackname,
                    trackmaster: track.trackmaster,
                    date_created: track.date_created
                }
            })
        })
    // Create a new track with the data from the request body
    const user = new User({
      trackname: req.body.trackname,
      trackmaster: req.body.trackmaster,
      date_created: Date.now(),
    });

    // Save the track in the database
    user.save((err, user) => {
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
          trackname: track.trackname,
          trackmaster: track.trackmaster,
          date_created: track.date_created,
        },
      });
    });
  }
  // CREATING COURSE LOGIC BEGINS **************************************************************
  // Check if the request is '/course'
  if (req.params.object == "course") {
    // Check if the course_name already exist in the database
    const courseNameExists = await course.findOne({
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
      coursename: req.body.coursename,
      courseduration: req.body.courseduration,
      coursemaster: req.body.coursemaster,
      coursetrack: req.body.coursetrack,
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
});

router.put("/:object/:id", (req, res) => {
  // logic for updating the various objects will be put here
});

router.delete("/:object/:id", (req, res) => {});

module.exports = router;
