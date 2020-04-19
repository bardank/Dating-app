const express = require('express');
const router =  express.Router();
const {check, validationResult} = require ('express-validator');
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');
const Match = require('../../models/Match');
const Notification = require('../../models/Notification');

// api/match/
router.get('/',auth, async(req, res)=>{
    try{
        let myMatch = await Match.findOne({user: req.user.id}).populate('likedMe.user', ['name', 'avatar']).populate('matches.user', ['name', 'avatar']);
        if(!myMatch){
            return res.status(400).json({msg : 'Seems like you have not created your profile'})
        }
        res.json(myMatch)
    }catch(err){
        console.error(err.message);
        return res.json('Server Error')
    }
});


router.post('/:id',auth, async(req, res)=>{
    try{
        let profile = await Profile.findById(req.params.id).populate("user", ['name']);
        const myProfile = await Profile.findOne({user : req.user.id}).populate("user", ['name', 'birthdate'])
        if(!myProfile){
            return res.status(400).json({msg : 'You must create your profile'})
        };
        if(!profile){
            return res.status(400).json({msg : 'There is no profile for this user'})
        }
        if(String(myProfile._id) === String(req.params.id) ){
            return res.status(400).json({msg : 'You cannot like your own profile'})
        };
        const myProfileDetails = {
            user: req.user.id,
            profile: myProfile._id,
        }
        
        const newLikedProfile = {
            user: profile.user._id,
            profile: req.params.id,
        }
        let myMatch = await Match.findOne({user: req.user.id});
        if(!myMatch){
            return res.status(400).json({msg : "Seems like you don't have profile"})
        }
        //check if profile has been liked already
        const alreadyLiked = myMatch.iLiked.filter(likedP=> String(likedP.profile) === req.params.id) ;
        const alreadyMatch = myMatch.matches.filter(likedP=> String(likedP.profile) === req.params.id) ;
        if (alreadyMatch.length > 0) {
            return res.status(400).json({ msg: 'You have already liked this User'})
        };
        if (alreadyLiked.length > 0) {
            return res.status(400).json({ msg: 'You have already liked this User'})
        };
    
        myMatch.iLiked.unshift(newLikedProfile);
        let othersMatch = await Match.findOne({user: profile.user._id});
        if(!othersMatch){
            return res.status(400).json({msg : 'Seems like you have not created your profile'})
        }
        othersMatch.likedMe.unshift(myProfileDetails)
        const theyLiked = othersMatch.iLiked.filter(likedP=> String(likedP.user) === String(req.user.id));
        if(theyLiked.length !== 0){
            myMatch.matches.unshift(newLikedProfile)
            othersMatch.matches.unshift(myProfileDetails)
            const removeIndex = othersMatch.iLiked.findIndex(like => String(like.profile) === String(myProfile._id));
                othersMatch.iLiked.splice(removeIndex, 1)
                
            const removeIndexLikedMES = othersMatch.likedMe.findIndex(like => String(like.profile) === String(myProfile._id));
                othersMatch.likedMe.splice(removeIndexLikedMES, 1)    
           
        
            const othersIndex = myMatch.iLiked.findIndex(like => String(like.profile) === req.params.id)
                myMatch.iLiked.splice(othersIndex, 1)
           
            
            const removeIndexLikedME = myMatch.likedMe.findIndex(like => String(like.profile) === req.params.id);
            myMatch.likedMe.splice(removeIndexLikedME, 1)
            let notification1 = await new Notification({
                createdBy : req.user.id,
                createdOn: profile.user._id,
                onModel:'User',
                text: `Its a match`,
                type: 'matched',
                receiver: [req.user.id, profile.user._id ]
            });
            await notification1.save();
            
            await othersMatch.save();
            await myMatch.save();
            const populateMatch =await myMatch.populate('likedMe.user', ['name', 'avatar']).populate('matches.user', ['name', 'avatar']).execPopulate()
            return res.json(populateMatch)
        }else{
            let notification2 = await new Notification({
                createdBy: req.user.id,
                createdOn : profile.user._id,
                text: `You got right swiped`,
                type: 'rightSwiped',
                onModel:'User',
                receiver: [profile.user._id ]
            });
            await notification2.save();
            await othersMatch.save();
            await myMatch.save();
            const populateMatch =await myMatch.populate('likedMe.user', ['name', 'avatar']).populate('matches.user', ['name', 'avatar']).execPopulate()
            return res.json(populateMatch)
        }
        
        
        
    }catch(error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})
router.delete('/:id',auth, async(req, res)=>{
    try{
        let profile = await Profile.findById(req.params.id).populate("user", ['name']);
        const myProfile = await Profile.findOne({user : req.user.id}).populate("user", ['name', 'birthdate'])
        if(!myProfile){
            return res.status(400).json({msg : 'You must create your profile'})
        };
        if(!profile){
            return res.status(400).json({msg : 'There is no profile for this user'})
        }
        if(String(myProfile._id) === String(req.params.id) ){
            return res.status(400).json({msg : 'You cannot like your own profile'})
        };
        
        let myMatch = await Match.findOne({user: req.user.id});
        if(!myMatch){
            return res.status(400).json({msg : "Seems like you don't have profile"})
        }

        const matchIndex = myMatch.matches.findIndex(likedP=> String(likedP.profile) === req.params.id) ;
        myMatch.matches.splice(matchIndex, 1);
        
    
        
        let othersMatch = await Match.findOne({user: profile.user._id});
        
        
        const othersMatchIndex = othersMatch.matches.findIndex(likedP=> String(likedP.user) === String(req.user.id));
        othersMatch.matches.splice(othersMatchIndex, 1);

        
        await othersMatch.save();
        await myMatch.save();
        const populateMatch = await myMatch.populate('likedMe.user', ['name', 'avatar']).populate('matches.user', ['name', 'avatar']).execPopulate()
        res.json(populateMatch);
    }catch(err){
        console.error(err.message);
        return res.json('Server Error')
    }
});


module.exports = router;