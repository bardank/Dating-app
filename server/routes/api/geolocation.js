const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const Match = require('../../models/Match');

//     /api/geolocation
router.post('/', auth, async(req, res)=>{
    try {
        let profile = await Profile.findOne({user: req.user.id})
        if(!profile){
            return res.status(400).json({errors : [{msg : "Profile doesn't exists"}]})
        };

        if(profile.locations.length > 0){
            if(String(profile.locations[0].location.coordinates[0]) === String(req.body.longitude) && String(profile.locations[0].location.coordinates[1]) === String(req.body.latitude) ){
                console.log("match", profile.locations.length)
                return res.json(profile) 
            };
        }
        

        const coords = [(req.body.longitude), (req.body.latitude)]
        const loc  = {location : {coordinates: coords}}
        profile.locations.unshift(loc)
        await profile.save()
        res.json(profile)

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


router.get('/', auth, async(req, res)=>{
    try {
        const myProfile  = await Profile.findOne({user: req.user.id});
        if(!myProfile){
            return res.status(400).json({errors : [{msg : "Profile is required "}]})
        };
        const coords = [myProfile.locations[0].location.coordinates[0], myProfile.locations[0].location.coordinates[1]]

        
        let profiles = await Profile.find({ "locations.location": {
            $near: {
                $maxDistance: (myProfile.distanceRange * 1000),
                $geometry: {
                 type: "Point",
                 coordinates: coords
                }
               }
            }
        }).populate('user', ["name", "birthdate"]);

        // let filterMe =  profiles.filter(profil=> String(profil.user._id) !== String(req.user.id));
        const myMatch = await Match.findOne({user: req.user.id})
        let matchProfileArray = [myProfile.id];
        const myLikedProfile = myMatch.iLiked.forEach(profil => {
            matchProfileArray.unshift(String(profil.profile))
        });
        const filterMatch = profiles.filter(profile => !matchProfileArray.includes(profile.id));
        res.json(filterMatch);
        
    }catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})


module.exports = router