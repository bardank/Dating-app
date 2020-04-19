const mongoose =  require('mongoose');
const chatRoomSchema = new mongoose.Schema({
    message:{
        type:String
    },
    users:[{
        type:mongoose.Schema.Types.ObjectId, ref:'User', required:true 
    }],
    sender:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User', 
    },
    status:{
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
},{timestamps: true});

module.exports = ChatRoom = mongoose.model('ChatRoom', chatRoomSchema)