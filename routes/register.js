if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const participants = require('../models/Participant');
const nodeMailer = require('nodemailer');

const router = express.Router();

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth : {
        type: 'Oauth2',
        user: process.env.EMAIL_SEND,  // import from .env
        pass: process.env.EMAIL_PASS,  // import from .env
        clientId: process.env.EMAIL_SENDER_CLIENT_ID,  //import from .env
        clientSecret: process.env.EMAIL_SENDER_CLIENT_SECRET,  // import from .env
        refreshToken: process.env.EMAIL_SENDER_REFERSH_TOKEN,  // import from .env
        accessToken: process.env.EMAIL_SENDER_ACCESS_TOKEN  // import from .env
    }
})

router.post('/', (req,res) =>{
    req.session.participant = req.body;
    // res.redirect('https://rzp.io/l/Kf1NWjz');
    res.redirect('/register/success');
});

router.get('/success', (req,res)=> {
    
    // let totalParticipants;
    // let lb;
    
    // participants.find({}, (err,teams) => {
    //    totalParticipants = teams.length; 
    // });
   
    
    // if(totalParticipants > 0 && totalParticipants < 26){
    //     lb = 1
    // }
    
    // if(totalParticipants > 25 && totalParticipants < 51){
    //     lb = 2
    // }
    
    // if(totalParticipants > 50 && totalParticipants < 76){
    //     lb = 3
    // }
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
        paymentId: req.body.razorpay_payment_id,
        lobby: 1
    });

    newParticipant.save().then(() => {
        // create the temporary array of the emails
        const emails = [];

        // if not null, push the email in the emails array
        if(req.session.participant.player1Email != ""){
            emails.push(req.session.participant.player1Email);
        }
        if(req.session.participant.player2Email != ""){
            emails.push(req.session.participant.player2Email);
        }
        if(req.session.participant.player3Email != ""){
            emails.push(req.session.participant.player3Email);
        }
        if(req.session.participant.player4Email != ""){
            emails.push(req.session.participant.player4Email);
        }
       

        console.log(emails);
        // build the template here
        let template = `
        <h2>  You have been successfully registered for </h2>
        <h1> Monthly Tournament PUBG JULY 2020 </h1>
        <b> Details: </b>
        <ul>  
            <li>Squad Name: ${req.session.participant.teamName}  </li>
            <li>Player 1 Name: ${req.session.participant.player1}  </li>
            <li>Player 2 Name: ${req.session.participant.player2}  </li>
            <li>Player 3 Name: ${req.session.participant.player3}  </li>
            <li>Player 4 Name: ${req.session.participant.player4}  </li>
            <li> Payment: Successful </li>
        </ul>
        <p> 
            Please read the rules for the tournament. <a href="https://monthly-tournament.herokuapp.com/rules"> Click here </a> to read the rules. <br />
            <b>  All the further details reguarding the tournamet will be provided via email </b>
        </p>
        `;

        // sending email for every player of the team
        emails.forEach( em => {
            const mailOptions = {
                from: process.env.EMAIL_SEND,  // sender's email
                to: em, // receiver's email
                subject: 'Registration Successful - Monthly tournament PUBG JULY 2020',
                html:   template// template gose here
            }
            // send the registration email form here
            transporter.sendMail(mailOptions, err => {
                if(err) console.log(err);
                else{
                    console.log('email sent to ' + em);
                }
            });
        })
        res.render('../views/success.ejs');
    }).catch(() => {
        res.render('../views/500.ejs');
    });
});

module.exports = router;
