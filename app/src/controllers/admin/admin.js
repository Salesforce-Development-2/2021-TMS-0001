const express = require('express');
const router = express.Router();

router.get('/:object', (req, res) =>{
    // logic for updating the various objects will be put here
})

// parameter object will be replaced with users, tracks, courses and assessment
router.post('/:object', (req, res) => { 
    // res.send('post added');
    // req.params.object
    console.log(req.params.object)
    if(req.params.object == 'users'){
        console.log(req.params.object)
    }
    res.status(200).end();
});

router.put('/:object/:id', (req, res) =>{
    // logic for updating the various objects will be put here
})

router.delete('/:object/:id', (req, res) =>{
    
})

module.exports = router;