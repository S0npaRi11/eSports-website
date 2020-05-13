const mongoose = require('mongoose');

const participantsSchema = mongoose.Schema({
    teamName: {
        type: String,
        unique: true,
        required: true
    },
    Player1:{
        type: String,
        required: true
    },
    Player1Email:{
        type: String,
        required: true
    },
    Player2:{
        type: String,
        default: ''
    },
    Player2Email:{
        type: String,
    },
    Player3:{
        type: String,
        default: ''
    },
    Player3Email:{
        type: String,
    },
    Player4:{
        type: String,
        default: ''
    },
    Player4Email:{
        type: String,
    },
    standing:{
        type: Number,
    },
    orderId:{
        type: String
    },
    status:{
        type: Boolean,
        default: 0
    },
    paymentId:{
        type: String,
    }
});

module.exports = mongoose.model('participant', participantsSchema);