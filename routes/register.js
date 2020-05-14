if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const Razorpay = require('razorpay');
const path = require('path');
const participants = require('../models/Participant');
const crypto = require('crypto');

const router = express.Router();

router.post('/', (req,res) =>{
   
    console.log(req.body); 
    if(process.env.NODE_ENV !== 'production'){
        require('dotenv').config();
    }
    req.session.participant = req.body;

    console.log(req.session.particiant);

    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_ID,
        key_secret: process.env.RAZORPAY_SECRET
    });

    // creating an order here
    const options = {
        amount: 50000,
        currency: 'INR'
    }

    instance.orders.create(options, (err,order) => {
        if(err) {
            console.log(err);
            res.render('../views/500.ejs');
        }
        else{
            console.log(order);
            res.render('../views/payment.ejs',{orderID: order.id, key: instance.key_id,teamName: req.session.participant.teamName, player1: req.session.participant.player1, player2: req.session.participant.player2, player3: req.session.participant.player3, player4: req.session.participant.player4});
        }
    });
});

router.post('/success', (req,res)=> {
    console.log(req.body);
    let generatedSignature = crypto
        .createHmac(
            "SHA256",
            process.env.RAZORPAY_SECRET
        ).update(req.body.razorpay_order_id + '|' + req.body.razorpay_payment_id)
        .digest('hex');
    let isSignatureValid = generatedSignature == req.body.razorpay_signature;

    if(isSignatureValid){
        const participant = new participants({
            teamName: req.session.particiant.teamName,
            Player1: req.session.particiant.player1,
            Player1Email:req.session.particiant.player1Email,
            Player2: req.session.particiant.player2,
            Player2Email:req.session.particiant.player2Email,
            Player3: req.session.particiant.player3,
            Player3Email:req.session.particiant.player3Email,
            Player4: req.session.particiant.player4,
            Player4Email:req.session.particiant.player4Email, 
            orderId: req.body.razorpay_order_id,
            paymentId: req.body.razorpay_payment_id
        });

        participant.save().then(() => {
            res.render('../views/payment.ejs',{meassage: 'You have been successfully registered for the Monthly Tournament-PUBG-June-2020!'});
        }).catch(() => {
            res.render('../views/500.ejs');
        });
    }
});

module.exports = router;