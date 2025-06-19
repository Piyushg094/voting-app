const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
       
    },
    password: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date,
        default: Date.now
    },
    age: {
        type: Number
    },
    mobile: {
        type: String
    },
    aadharCardNumber:{
        type: Number,
        required: true,
        unique: true
    },
    role : {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter',
    },
    isVote :{
        type: Boolean,
        default: false
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
