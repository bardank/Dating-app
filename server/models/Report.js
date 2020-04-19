const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    reportedOn:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        required: true,
        default: 'Post',
        enum: ['Post', 'User']
    },
    reportReason:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});
module.exports = Report = mongoose.model('Report', reportSchema);