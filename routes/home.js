const express = require('express');
const teams = require('../models/Participant');

const router = express.Router();

router.get('/', (req,res) => {
   teams.find({}, (err,team) => {
    if(err) console.log(err);
    else{
        res.render('../views/index.ejs', {total: team.length});
    }
   });
});

module.exports = router;