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
    // res.send('post added');
    // req.params.object
    console.log(req.params.object)
    if(req.params.object == 'users'){
        Role.findOne({"role_type": req.body.role_type}, (err, role)=>{
            console.log(role.id);
            const trainee1 = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: req.body.password,
                username: req.body.username,
                email: req.body.email,
                role_type: role.id,
                date_created: Date.now()
            })
            trainee1.save((value) =>{
                console.log(value);
            })
        });


    }

    res.status(200).end();
});

router.put('/:object/:id', (req, res) =>{
    // logic for updating the various objects will be put here
})

router.delete('/:object/:id', (req, res) =>{
    
})

module.exports = router;