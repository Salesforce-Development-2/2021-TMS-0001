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

// const modelMapper = {
//     users: User,
//     roles: Role,
//     tracks: Track,
//     courses: Course,
//     batches: Batch,
//     assessments: Assessment
// }

// Get all resources endpoint
router.get("/:object", async (req, res) => {
    if(!global.modelMapper[req.params.object]) return res.status(404).json({
      code: "not-found",
      message: "The resource request is not found"
    })

    const data = await global.modelMapper[req.params.object].find()
    if(data.length < 1){
      return res.json({
        code: "success",
        message: "No record found",
    })
    }
    return res.json({
        code: "success",
        message: "request granted",
        result: data
    })
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
      user.save(async (err, user) => {
        if (err) {
          return res.json({
            code: "failed",
            message: "Failed to save data in database",
            error: err,
          });
        }
        // Find the batch with the batch name if it was provided
        let batch_name = req.body.batch_name;

        if(batch_name){
          const batch = await Batch.findOne({batch_name: batch_name });

          // if batch is not found return 404
          if(!batch) res.status(404).json({
            code: "batch-not-found",
            message:"batch is not found"
          })
          // set the user id of the batch with the specified 
          batch.user_id.push(user._id);
          batch.save();
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
  if(req.params.object == 'tracks'){
    // Check if the track already exist in the database
    const trackNameExists = await Track.findOne({"track_name": req.body.track_name})

    // If track already exists return bad request
    if(trackNameExists){
        return res.status(400).json({
            code: "track-exist",
            message: "Track already exists"
        })
    }
      // Create a new track with the data from the request body 
      const track = new Track({
        track_name: req.body.track_name,
        track_master: req.body.track_master,
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
                track_name: track.track_name,
                track_master: track.track_master,
                date_created: track.date_created
            }
        })
    })
  }

  //create batch route and logic for post method
  if(req.params.object == 'batch'){
    // Check if the batch already exist in the database
    const batchNameExists = await Batch.findOne({"batchname": req.body.batch_name})

    // If batch already exists return bad request
    if(batchNameExists){
        return res.status(400).json({
            code: "batch-exist",
            message: "Batch already exists"
        })
    }
      // Create a new batch with the data from the request body 
      const batch = new Batch({
        batch_name: req.body.batch_name,
        date_created: Date.now(),
    })

    // Save the batch data in the database
    batch.save((err, batch) =>{
        if(err){
            return res.json({
                code: "failed",
                message: "Failed to save batch data in database",
                error : err
            })
        }
        return res.json({
            code: "success",
            message: "batch created",
            result: {
                batch_name: batch.batchname,
                date_created: batch.date_created
            }
        })
    })
  }


  // CREATING COURSE LOGIC BEGINS **************************************************************
  // Check if the request is '/course'
  if (req.params.object == "course") {
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
      if (req.params.object == "assessment") {
      

        //Create new assessment with data from req body
        const assessment = new Assessment ({
          assessment_type: req.body.assessment_type,
          score: req.body.score,
          course_id: req.body.course_id
        })
    
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
              result: assessment
            });
          });
    }

});



router.put("/:object/:id", async (req, res) => {
  // logic for updating the various objects will be put here'
    if(!global.modelMapper[req.params.object]) return res.status(404).json({
        code: "not-found",
        message: "The resource request is not found"
    })
    const object = await global.modelMapper[req.params.object].findById(req.params.id);
    if(!object) return res.status(404).json({
        code: "not-found",
        message: "Resource not found"
    })
    for(const field of Object.keys(req.body)){
        object[field] = req.body[field];
    }
    object.save((err, value) =>{
        return res.json(value)
    })
    
});

// Register a route to delete resources
router.delete("/:object/:id", async (req, res) => {

    const object = await global.modelMapper[req.params.object].findById(req.params.id);
    if(!object) return res.status(404).json({
        code: "not-found",
        message: "Resource not found"
    })
    await global.modelMapper[req.params.object].deleteOne({_id: req.params.id});
    return res.json({
        code: "success",
        message: "resource deleted",
        result: object
    })


});

module.exports = router;