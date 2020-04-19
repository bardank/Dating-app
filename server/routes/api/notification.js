const express = require('express');
const router =  express.Router();
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');
const Match = require('../../models/Match');
const Notification = require('../../models/Notification');
const mongoose = require('mongoose');


// /api/notifications
router.get('/', auth, async(req, res)=>{
    try {
        const notifications = await Notification.find({"receiver": { "$in": [mongoose.Types.ObjectId(req.user.id)]}}).populate('createdBy',['name', 'avatar']).populate('createdOn',['image']);

        res.json(notifications);
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router
