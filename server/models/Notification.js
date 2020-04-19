const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    createdOn:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        refPath: 'onModel'
    },
    text:{
        type:String,
        required: true
    },
    type:{
        type:String,
        required: true
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Post', 'User']
    },
    receiver: [{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User'
    }], // Ids of the receivers of the notification
    read_by:[{
     readerId:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
     read_at: {type: Date, default: Date.now}
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    }

});
module.exports = Notification = mongoose.model('Notification', notificationSchema);