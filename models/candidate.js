const mongoose = require('mongoose')

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    PartyCandidateNum:{
        type : Number,
        required:true,
        unique : true,
    },
    party: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        trim: true
    },
    votes: [
        {
            users:{
                type : mongoose.Schema.Types.ObjectId,
                ref : 'User',
                
            },

            votedAt: {
                type : Date,
                default: Date.now()
            }
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    voteCount:{
        type: Number,
        required : true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate