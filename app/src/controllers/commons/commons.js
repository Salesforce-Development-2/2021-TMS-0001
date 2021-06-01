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

const homePage = require('../../utils/ui')

global.modelMapper = {
    users: User,
    roles: Role,
    tracks: Track,
    courses: Course,
    batches: Batch,
    assessments: Assessment
}
router.get('/', (req, res) =>{
    return res.send(homePage);
})
// Get details of one resource endpoint
router.get("/:role/:object/:id", async (req, res) =>{
    if(req.params.role == "user" || req.params.role == "admin"){
        const object = await global.modelMapper[req.params.object].findById(req.params.id);
        if(!object) return res.status(404).json({
            code: "not-found",
            message: "Resource not found"
        })
        return res.json({
            code: "success",
            message: "request granted",
            result: object
        })
    }else{
        return res.status(404).json({
            code: "not-found",
            message: "Resource not found"
        })
    }
})

module.exports = router;