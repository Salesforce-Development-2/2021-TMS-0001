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

// Import managers to hanlde database operations
const userService = require("../services/userService");
const batchService = require("../services/batchService");
const roleService = require("../services/roleService");
const trackService = require("../services/trackService");

router.post("/", async (req, res) =>{
      //create assessment route and logic for post method
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

})


router.put("/:id", async (req, res) => {
    // logic for updating the various objects will be put here'
  
    let assessment = await Assessment.findById(
      req.params.id
    );
  
    //Validate the incoming data
    const { error } = await validators.assessmentValidation(req.body);

    if (error) {
      return res.status(400).json({
        code: "invalid-data",
        err: error.message,
      });
    }
    
    if (!assessment)
      return res.status(404).json({
        code: "not-found",
        message: "The resource request is not found",
      });

  
    for (const field of Object.keys(req.body)) {
        assessment[field] = req.body[field];
    }
    assessment.save((err, value) => {
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
    const assessment = await Assessment.findById(
      req.params.id
    );
  
    if (!assessment)
      return res.status(404).json({
        code: "not-found",
        message: "Resource not found",
      });
  
    let deletedAssessment  = await Assessment.deleteOne({ _id: req.params.id });
  
    return res.json({
      code: "success",
      message: "resource deleted",
      result: deletedAssessment,
    });
  });

  module.exports = router;