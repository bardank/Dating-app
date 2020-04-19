const express = require('express');
const router =  express.Router();
const {check, validationResult} = require ('express-validator');
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');
const storage = require('../../utils/imageConfig');
const multer = require('multer');
const User = require('../../models/User');
const Match = require('../../models/Match');
const mongoose = require('mongoose');

// api/profile/



router.put('/update', [auth,
    check('gender', 'Gender field is empty').not().isEmpty(),
    check('interestedIn', 'Interested In field is empty').not().isEmpty(),
],  async(req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    const {gender, interestedIn, bio, jobTitle} = req.body
    try {
        let profile = await Profile.findOne({user : req.user.id});
        if(!profile){
            return res.status(400).json({errors : [{msg : "Profile doesn't exists"}]})
        }
        //update
        profile = await Profile.findOneAndUpdate(
            {user: req.user.id},
            {$set:{ "bio" : bio, 'gender': gender, 'interestedIn': interestedIn, 'jobTitle': jobTitle }  },
            {new :true}
        )

        await profile.save();
        const populateProfile = await profile.populate("user", ['name', 'birthdate', 'email']).execPopulate();

        res.json(populateProfile);
        
        
        
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error')
    }
});
router.post('/peoplearound',auth, async(req, res)=>{
    try {
        const {distanceRange, minAge , maxAge} = req.body ;
        
        let profile = await Profile.findOne({user : req.user.id})
        if(!profile){
            return res.status(400).json({msg : 'There is no profile for this user'})
        };
        profile = await Profile.findOneAndUpdate(
            {user: req.user.id},
            {$set: {"distanceRange": distanceRange, "ageBetween":{
                "minAge": minAge,
                "maxAge": maxAge
            }}},
            {new :true}
        );

        await profile.save();
        const populateProfile = await profile.populate("user", ['name', 'birthdate', 'email']).execPopulate()
        res.json(populateProfile);

        
    }catch(error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})


router.get('/me',auth, async(req, res)=>{
    try{
        let profile = await Profile.findOne({user : req.user.id}).populate("user", ['name', 'birthdate', 'email'])
        if(!profile){
            return res.status(400).json({msg : 'There is no profile for this user'})
        }
        res.json(profile)
        
    }catch(error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})

router.delete('/', [auth,
    check('password', 'Password is requires').exists()
], async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    try{
        let user = await User.findById(req.user.id)
        if(!user){
            return res.status(400).json({errors : [{msg : 'Invalid Credentials'}]})
        }

        const isMatch = await user.correctPassword(req.password, user.password);
        if(!isMatch){
            return res.status(400).json({errors : [{msg : 'Invalid Credentials'}]})
        }
        await Post.deleteMany({user: req.user.id})
        await Profile.findOneAndRemove({user: req.user.id}),
        await User.findOneAndRemove({_id: req.user.id})
        res.json({msg: "user deleted"});
    }catch(err){
        console.log(err.message);
        return res.json('Server Error')
    }
});

//image upload 
const imageFilter = function(req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are accepted!'), false);
    }
    cb(null, true);
    };


const upload = multer({ storage: storage, fileFilter: imageFilter });
const cloudinary = require("cloudinary");
cloudinary.config({
cloud_name: process.env.CLOUD_NAME, //ENTER YOUR CLOUDINARY NAME
api_key: process.env.CLOUDINARY_API_KEY, // THIS IS COMING FROM CLOUDINARY WHICH WE SAVED FROM EARLIER
api_secret: process.env.CLOUDINARY_API_SECRET // ALSO COMING FROM CLOUDINARY WHICH WE SAVED EARLIER
});
    


//feature
router.post('/photos', [auth ,upload.single("image")], (req, res)=>{
    
    
    cloudinary.v2.uploader.upload(req.file.path, async(err, result)=>{
        if(err){
            return res.status(400).json({err: 'Something went wrong'})
        }
        const image = result.secure_url ;
        const imageId = result.public_id;
        const newImg = { image, imageId}

        try {
            if(!req.file.path ){
                return res.status(400).json({errors : [{msg : 'Please select an image'}]})
            }
            let profile = await Profile.findOne({user : req.user.id})
            if(!profile){
                return res.status(400).json({errors : [{msg : "Profile doesn't exists."}]})
            }
            if(profile.photos.length >= 6){
                return res.status(400).json({errors : [{msg : "Please delete some feature photo to upload new image"}]})
            }
            profile.photos.unshift(newImg)
            await profile.save();
            const populateProfile = await profile.populate("user", ['name', 'birthdate', 'email']).execPopulate()
            res.json(populateProfile);
    
        } catch (error) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }

    } )
    
});


//create profile
router.post('/', [auth ,upload.single("image")], (req, res)=>{
    
    cloudinary.v2.uploader.upload(req.file.path, async(err, result)=>{
        if(err){
            return res.status(400).json({err: 'Something went wrong'})
        }
        const image = result.secure_url ;
        const imageId = result.public_id;
        const newImg = { image, imageId}

        try {
            if(!req.file ){
                return res.status(400).json({errors : [{msg : 'Please select an image'}]})
            }
            const user = await User.findOneAndUpdate({"_id": req.user.id}, 
                {$set : {"avatar": image}},
                {new :true}
            );
            
            let profile = await User.findOne({"user":req.user.id})
            if(profile){
                return res.status(400).json({errors : [{msg : "Profile already exists."}]})
            }
            profile = await new Profile({user : req.user.id});
            profile.avatar.unshift(newImg);
            profile.ageBetween = {};
            profile.ageBetween.minAge = 18 ;
            profile.ageBetween.maxAge = 30 ;
            profile.distanceRange = 50;
            await profile.save();
            const match = await new Match({user: req.user.id});
            await match.save();
            
            const populateProfile = await profile.populate("user", ['name', 'birthdate', 'email']).execPopulate()
            res.json(populateProfile);
    
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error')
        }

    } )
   
});

//avatar upload 
router.put('/avatar', [auth ,upload.single("image")], (req, res)=>{
    
    cloudinary.v2.uploader.upload(req.file.path, async(err, result)=>{
        if(err){
            return res.status(400).json({err: 'Something went wrong'})
        }
        const image = result.secure_url ;
        const imageId = result.public_id;
        const newImg = {image, imageId}

        try {
            if(!req.file ){
                return res.status(400).json({errors : [{msg : 'Please select an image'}]})
            }
            const user = await User.findOneAndUpdate({_id: req.user.id}, 
                {$set : {"avatar": image}},
                {new :true}
            );
            let profile = await Profile.findOne({user:req.user.id})
            if(!profile){
                return res.status(400).json({errors : [{msg : "Profile doesn't exists."}]})
            }
            profile.avatar.unshift(newImg);
           
            await profile.save();
            const populateProfile = await profile.populate("user", ['name', 'birthdate', 'email']).execPopulate()
            res.json(populateProfile);
    
        } catch (error) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    } )
    
});
router.delete('/photos/:id', auth, async(req, res)=>{
    try {
        
        const profile = await  Profile.findOne({user: req.user.id}).select('-ageBetween').select('-locations').select('-distanceRange').populate('user', ["name", "avatar", "birthdate"]);
        if(!profile){
            return res.status(400).json({errors : [{msg : 'Profile does not exist'}]})
        }
        const removeIndex = profile.photos.findIndex(photo => String(photo._id) === String(req.params.id))
        profile.photos.splice(removeIndex, 1);
        await profile.save()
        res.json(profile.photos)
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error')
    }
})
router.get('/:id', auth, async(req, res)=>{
    try {
        let objectId = mongoose.Types.ObjectId(req.params.id)

        let matches = await Match.findOne({user: req.user.id, matches:{$elemMatch:{user: objectId}}})
        if(!matches){
            let likedMe = await Match.findOne({user: req.user.id, likedMe:{$elemMatch:{user: objectId}}})
            if(!likedMe || !matches){
                return res.status(400).json({errors : [{msg : 'You must be matched to the user or user must like you'}]})
            }
        }
        const profile = await  Profile.findOne({user: req.params.id}).select('-ageBetween').select('-locations').select('-distanceRange').populate('user', ["name", "avatar", "birthdate"]);
        if(!profile){
            return res.status(400).json({errors : [{msg : 'Profile does not exist'}]})
        }
        res.json(profile)
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error')
    }
})


module.exports = router;