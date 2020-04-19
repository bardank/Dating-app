const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    iLiked: [{
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        profile:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile'
        },
        date:{
            type: Date,
            default: Date.now()
        }
    }],
    likedMe: [{
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        profile:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile'
        },
        date:{
            type: Date,
            default: Date.now()
        }
    }],
    matches: [{
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        profile:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile'
        },
        date:{
            type: Date,
            default: Date.now()
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    }

});
module.exports = Match = mongoose.model('Match', matchSchema);