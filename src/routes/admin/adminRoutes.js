const express = require('express');
const router = express.Router();

// parameter object will be replaced with users, tracks, courses and assessment
router.post('/:object', (req, res) => { 
    // res.send('post added');
    // req.params.object
});

router.put('/:object/:id', (req, res) =>{
    // logic for updating the various objects will be put here
})

module.exports = router;