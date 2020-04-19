const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const Chat = require('../../models/Chat');
const ChatRoom = require('../../models/ChatRoom');
const Match = require('../../models/Match');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const mongoose = require('mongoose');


router.get('/list', auth, async(req, res)=>{
    try {
        
        const chatlist =  await ChatRoom.find({users: { "$in" : [mongoose.Types.ObjectId(req.user.id) ]}}).sort({
            updatedAt: -1
        }).populate('users', ['name', 'avatar']);
        if(!chatlist){
            return res.json([]); 
        } 
        else if(chatlist){
            let chatLists = chatlist.filter((e)=> e.message );
            return res.json(chatLists);
        }
        res.json(chatlist);
    } catch (error) {
        console.log(error.message)
        res.status(500).json('Server error');
    }
});
router.get('/:id', auth, async(req, res)=>{
    try{
        const page = parseInt(req.query.page)
        const limit = 8;
        let objectId = mongoose.Types.ObjectId(req.params.id)
        const matches = await Match.findOne({user: req.user.id, matches:{$elemMatch:{user: objectId}}})
        if(!matches){
            return res.status(400).json({errors : [{msg : 'You must be matched to this user'}]})
        }
        let chatRoom =  await ChatRoom.findOne({ "users": { "$all" : [mongoose.Types.ObjectId(req.user.id) ,objectId]} }).populate('users',['name', 'avatar']);

        if(!chatRoom){
            chatRoom = await new ChatRoom({
                users : [  req.user.id,  req.params.id]
            });
            const room= await chatRoom.save();
            chatRoom = await room.populate("user", ['name', 'birthdate', 'email']).execPopulate()
        }
        const messages = await Chat.find({ "room": chatRoom._id},)
        .sort({'createdAt': -1})
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('sender', ["name", "avatar"]);
        let messagesLi ;
        if(messages && messages.length > 0){
            messagesLi= messages.reverse()
        }else{
            messagesLi = []
        }


        return res.json([messages, chatRoom]);
    }catch(err){
        console.error(err.message)
        res.status(500).json('Server error')
    }
});

module.exports = router;

// for (let i = messages.length - 1; i >= 0; --i) {
//     messagesLi.push(messages[i])
// }