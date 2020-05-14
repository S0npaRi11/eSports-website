const express = require('express');
const participant = require('../models/Participant');

const router = express.Router();

router.get('/', (req,res) => {
    const teams = [];
   participant.find({}, (err,team) => {
       if(err){
        console.log(err);
        res.render('../views/.ejs');
       }
       else{
            team.forEach(t => {
                teams.push(t.teamName);
            });
            res.send(JSON.stringify(teams));
        }
   });
});

module.exports = router;