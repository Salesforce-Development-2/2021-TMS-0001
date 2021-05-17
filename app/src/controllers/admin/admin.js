const express = require('express');
const router = express.Router();
const User = require('../../models/user')
const Role = require('../../models/role') 
const Action = require('../../models/actions');
const actions = require('../../models/actions');

router.get('/:object', (req, res) =>{
    // logic for updating the various objects will be put here
})

// parameter object will be replaced with users, tracks, courses and assessment
router.post('/:object', async (req, res) => { 

    // Check if the request is /users
    if(req.params.object == 'users'){

        // Check if the email already exist in the database
        const emailExists = await User.findOne({"email": req.body.email})

        // If email already exists return bad request
        if(emailExists){
            return res.status(400).json({
                code: "email-exists",
                message: "Email already exists",
            })
        }

        // Find the type of role with the role_type specified in the request body
        Role.findOne({"role_type": req.body.role_type}, (err, role)=>{
            
            //If the role doesn't exist return 404 of role doesn't exist
            if(!role){
                return res.status(404).json({
                    code: "resource-not-found",
                    message: "The specified role is not found",
                })
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
            })

            // Save the user in the database
            user.save((err, user) =>{
                if(err){
                    return res.json({
                        code: "failed",
                        message: "Failed to save data in database",
                        error : err
                    })
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
                        role_type: user.role_type
                    }
                })
            })
        });



    }
});

router.put('/:object/:id', (req, res) =>{
    // logic for updating the various objects will be put here
})

router.delete('/:object/:id', (req, res) =>{
    
})

module.exports = router;