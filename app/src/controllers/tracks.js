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
const trackService = require("../services/trackService");

//create track route and logic for post method
router.post("/", async (req, res) => {
  // If the request user is not admin return 401
  if (req.user.role.role_title != "admin") {
    return res.status(401).json({
      code: "unauthorized",
      message: "User is not allowed to get create tracks"
    })
  }
  //validate incomimg data
  const { error } = await validators.trackValidation(req.body);
  if (error) {
    return res.status(400).json({
      code: "invalid-data",
      err: error.message,
    });
  }

  // If track already exists return bad request
  if (await trackService.getTrackByName(req.body.track_name)) {
    return res.status(400).json({
      code: "track-exist",
      message: "Track already exists",
    });
  }


  // Create a new track with the data from the request body
  const savedTrack = await trackService.createTrack({
    track_name: req.body.track_name,
    track_master: req.body.track_master
  })

  // If the track is null this means the track couldn't save
  if (!savedTrack) {
    return res.status(500).json({
      code: "failed",
      message: "Failed to save track data in database",
    });
  }

  // Return 200 if the track saved successfully
  return res.json({
    code: "success",
    message: "Track created",
    result: {
      id: savedTrack.id,
      track_name: savedTrack.track_name,
      track_master: savedTrack.track_master,
      date_created: savedTrack.date_created,
    },
  });
})

// Register a route to edit track
router.put("/:id", async (req, res) => {

  let error;
  // If request is not coming from an authorized admin reutrn 401
  if (req.user.role.role_title != "admin") {
    return res.status(401).json({
      code: "unathorized",
      message: "User is not allowed to edit a track"
    })
  }
  let updatedTrack;

  if(req.query.enroll){
    updatedTrack = await trackService.enrollUser(req.params.id, req.query.enroll);
    error = updatedTrack.error;
  }
  else if(req.query.unenroll){
    updatedTrack = await trackService.unEnrollUser(req.params.id, req.query.unenroll);
    error = updatedTrack.error;
  }
  else {
      // Validate the incoming data
    error  = await validators.trackValidation(req.body).error;

    // return error if validation fails
    if (error) {
      return res.status(400).json({
        code: "invalid-data",
        err: error.message,
      });
    }
    updatedTrack = await trackService.updateTrack(req.params.id, req.body);

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
    message: "Track updated successfully",
    result: updatedTrack
  });
});


// Register a route to delete track.
router.delete("/:id", async (req, res) => {

  // Find the track by id
  const track = await Track.findById(
    req.params.id
  );

  // If the track is not found return 404
  if (!track)
    return res.status(404).json({
      code: "not-found",
      message: "Resource not found",
    });

  // Delete the track
  let deletedTrack = await Track.deleteOne({ _id: req.params.id });

  return res.json({
    code: "success",
    message: "resource deleted",
    result: deletedTrack,
  });
});

// Register a route to get all users
router.get("/", async (req, res) => {


  // if there users in the query parameters
  // Return the list of tracks the user has been enrolled in

  if(req.query.user){
    
    const userTracks = await trackService.getUserTracks(req.query.user);
    return res.json({
      code: "success",
      result: userTracks
    })
  }

    // If the request is coming from a user access level return 401
    if (req.user.role.role_title != "admin") {
      if (req.params.id != req.user.id) {
        return res.status(401).json({
          code: "unauthorized",
          message: "User is not allowed to get all users"
        })
      }
    }

  // Get all tracks from the database
  const tracks = await trackService.getTracks();
  return res.json({
    code: "success",
    result: tracks
  })
})


router.get("/:id", async (req, res) =>{
  
  // Get the track from the database
  const track = await trackService.getTrack(req.params.id);

  // If the request is not coming from an admin
  if(req.user.role_type.role_type != "admin"){

    // If the request user id is not the same as the request params id return 401
    // This is done because other users are not allowed to get other users details
    if(!await trackService.isUserEnrolled(req.params.id, req.user.id)){
      return res.status(401).json({
        code: "unauthorized",
        message: "User is not allowed to get other tracks details"
      })
    }
    
    // 
    else{
      return res.json({
        code: "success",
        result: track
      })
    }
  }
  return res.json({
    code: "success",
    result: track
  })
})

module.exports = router;