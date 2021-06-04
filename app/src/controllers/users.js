// CORE MODULES
const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Role = require("../models/role");
const validators = require("../validators/validators");

// Import managers to hanlde database operations
const userService = require("../services/userService");
const batchService = require("../services/batchService");
const roleService = require("../services/roleService");

// Register a route to create a user
router.post("/", async (req, res) => {

  // If request is not coming from an authorized admin reutrn 401
  if (req.user.role_type.role_title != "admin") {
    return res.status(401).json({
      code: "unathorized",
      message: "User is not allowed to create a user"
    })
  }
  // Validate the incoming data
  const { error } = await validators.userValidation(req.body);
  if (error) {
    return res.status(400).json({
      code: "invalid-data",
      err: error.message,
    });
  }

  // If email already exists return bad request
  if (await userService.getUserByEmail(req.body.email)) {
    return res.status(400).json({
      code: "email-exists",
      message: "Email already exists",
    });
  }

  //If the role doesn't exist return 404 of role doesn't exist
  if (!(await userService.getUserRole(req.body.role_type))) {
    return res.status(404).json({
      code: "resource-not-found",
      message: "The specified role is not found",
    });
  }

  // Create a new user with the data from the request body
  const savedUser = await userService.createUser({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
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
  const updatedBatch = await batchService.enrollUser(
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
      role_type: await roleService.getUserRoleName(savedUser.role_type),
    },
  });

})

// Register a route to edit user info
router.put("/:id", async (req, res) => {

  // Validate the incoming data
  const { error } = await validators.userValidation(req.body);

  // return error if validation fails
  if (error) {
    return res.status(400).json({
      code: "invalid-data",
      err: error.message,
    });
  }

  // If request is not coming from an authorized admin reutrn 401
  if (req.user.role.role_title != "admin") {
    return res.status(401).json({
      code: "unathorized",
      message: "User is not allowed to edit a user"
    })
  }

  req.body.role = req.user.role._id;

  let updatedUser = await userService.updateUser(req.params.id, req.body);

  // If the user is not updated return resource not found
  if(!updatedUser){
    return res.status(404).json({
      code: "not-found",
      message: "The resource is not found",
    });
  }

  // if successful return 200 with result
  return res.json({
    code: "success",
    message: "User updated successfully",
    result: updatedUser
  });
});

//  Register a route to delte a user
router.delete("/:id", async (req, res) => {

  // If request is not coming from an authorized admin reutrn 401
  if (req.user.role_type.role_title != "admin") {
    return res.status(401).json({
      code: "unathorized",
      message: "User is not allowed to delete a user"
    })
  }
  let result = await userService.deleteUser(req.params.id);
  if (!result)
    return res.status(404).json({
      code: "not-found",
      message: "Resource not found",
    });

  return res.json({
    code: "success",
    message: "resource deleted",
    result: result
  });
});

// Register a route to get all users
router.get("/", async (req, res) => {
  if (req.user.role.role_title != "admin") {
    if (req.params.id != req.user.id) {
      return res.status(401).json({
        code: "unauthorized",
        message: "User is not allowed to get all users"
      })
    }
  }
  const users = await userService.getUsers();
  return res.json({
    code: "success",
    result: users
  })
})

// Register a route to get a details of a single user
router.get("/:id", async (req, res) => {

  // Get the user from database
  const user = await userService.getUser(req.params.id);

  // If the request is not coming from an admin
  if (req.user.role.role_title != "admin") {

    // If the request user's id is not the same as the request params id return 401
    // This is done because other users are not allowed to get other user's details
    if (req.params.id != req.user.id) {
      return res.status(401).json({
        code: "unauthorized",
        message: "User is not allowed to get other users details"
      })
    }

    // If its the same user return the details
    else {
      return res.json({
        code: "success",
        result: user
      })
    }
  }

  // If its an admin return without any checks
  return res.json({
    code: "success",
    result: user
  })
})

module.exports = router;