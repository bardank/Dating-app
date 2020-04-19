const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    gender: {
        type: String,
    },
    interestedIn: {
        type: String
    },
    ageBetween: {
        minAge :{
            type: Number
        },
        maxAge:{
            type: Number
        }
    }, 
    distanceRange:{
        type: Number
    },
    bio:{
        type: String
    },
    jobTitle:{
        type: String
    },
    likes: {
        type: Number,
        default: 5
    },
    locations: [{
        location: {
            type: { 
                type: String , 
                default: "Point"  
            },
            coordinates: {
                type: [Number],
                index: "2dsphere"
            },createdAt: {
                type: Date,
                default: Date.now
            }
            
        }
    }],
    avatar: [{
        image: {
            type: String
        },
        imageId: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    photos:[{
        image: {
            type: String
        },
        imageId: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }

});
profileSchema.index({ "locations.location": "2dsphere" })
module.exports = Profile = mongoose.model('Profile', profileSchema);