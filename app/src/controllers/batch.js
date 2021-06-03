// CORE MODULES
const express = require("express");
const router = express.Router();

const Batch = require("../models/batch");
const validators = require("../validators/validators");

// Import managers to hanlde database operations
const batchService = require("../services/batchService");

router.post("/", async (req, res) => {

  //create batch route and logic for post method
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
})


router.put("/:id", async (req, res) => {

  let batch = await Batch.findById(
    req.params.id
  );

  if (!batch)
    return res.status(404).json({
      code: "not-found",
      message: "The resource request is not found",
    });

  for (const field of Object.keys(req.body)) {
    batch[field] = req.body[field];
  }

  batch.save((err, value) => {
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
  const batch = await Batch.findById(
    req.params.id
  );

  if (!batch)
    return res.status(404).json({
      code: "not-found",
      message: "Resource not found",
    });

  let deletedBatch = await Batch.deleteOne({ _id: req.params.id });

  return res.json({
    code: "success",
    message: "resource deleted",
    result: deletedBatch,
  });
});

module.exports = router;