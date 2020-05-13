const mongoose = require('mongoose');

const ordersSchema = mongoose.Schema({
    teamName: {
        type: String,
        unique: true,
        required: true
    },
    Player1:{
        type: String,
        required: true
    },
    Player2:{
        type: String,
        default: ''
    },
    Player3:{
        type: String,
        default: ''
    },
    Player4:{
        type: String,
        default: ''
    },
    standing:{
        type: Number,
    }
});

module.exports = mongoose.model('order', ordersSchema);