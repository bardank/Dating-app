const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Profile'
    },
    caption:{
        type: String
    },
    image: {
        type: String
    },
    imageId: {
        type: String
    },
    likes: [{
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        date:{
            type: Date,
            default: Date.now
        }
    }],
    comments: [{
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text:{
            type: String,
            required: true
        },
        date:{
            type: Date,
            default: Date.now
        },
        likes: [{
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            date:{
                type: Date,
                default: Date.now
            }
        }],
        replies:[{
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            text:{
                type: String,
                required: true
            },
            likes: [{
                user:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                date:{
                    type: Date,
                    default: Date.now
                }
            }],
            date:{
                type: Date,
                default: Date.now
            },
        }]
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }

});
module.exports = Post = mongoose.model('Post', postSchema);