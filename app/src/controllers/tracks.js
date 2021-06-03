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
  if (req.user.role_type.role_type != "admin") {
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

  // If the request user is not admin return 401
  if(req.user.role_type.role_type != "admin"){
    return res.status(401).json({
      code: "unauthorized",
      message: "User is not allowed to get edit tracks"
    })
  }



  if (!track)
    return res.status(404).json({
      code: "not-found",
      message: "The resource request is not found",
    });


  track.save((err, value) => {
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
  const track = await Track.findById(
    req.params.id
  );

  if (!track)
    return res.status(404).json({
      code: "not-found",
      message: "Resource not found",
    });

  let deletedTrack = await Track.deleteOne({ _id: req.params.id });

  return res.json({
    code: "success",
    message: "resource deleted",
    result: deletedTrack,
  });
});

router.get("/:id", async (req, res) =>{
  
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