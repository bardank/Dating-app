const mongoose =  require('mongoose');

const chatSchema = new mongoose.Schema({
    message:{
        type:String, 
        required:true 
    },
    users:[{
        type:mongoose.Schema.Types.ObjectId, ref:'User', required:true 
    }],
    room:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    read:{
        type: Boolean,
        default: false
    },
    type:{
        type: String,
        required: true
    }, 
    createdAt:{
        type : Date,
        default:  Date.now
    }
});
module.exports = Chat = mongoose.model('Chat', chatSchema)