if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const participants = require('../models/Participant');;

const router = express.Router();

router.post('/', (req,res) =>{
    req.session.participant = req.body;
    res.redirect('https://rzp.io/l/Kf1NWjz');
});

router.get('/success', (req,res)=> {
   
    const newParticipant = new participants({
        teamName: req.session.participant.teamName,
        Player1: req.session.participant.player1,
        Player1Email:req.session.participant.player1Email,
        Player2: req.session.participant.player2,
        Player2Email:req.session.participant.player2Email,
        Player3: req.session.participant.player3,
        Player3Email:req.session.participant.player3Email,
        Player4: req.session.participant.player4,
        Player4Email:req.session.participant.player4Email, 
        orderId: req.body.razorpay_order_id,
        paymentId: req.body.razorpay_payment_id
    });

    newParticipant.save().then(() => {
        res.render('../views/success.ejs');
    }).catch(() => {
        res.render('../views/500.ejs');
    });
});

module.exports = router;