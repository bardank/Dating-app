const express = require('express');
const router =  express.Router();
const {check, validationResult} = require("express-validator");
const User  = require('../../models/User');
const createSendToken = require('../../utils/authController');
const auth = require('../../middleware/auth')


// api/users/

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email address').isEmail(),
    check('birthdate', 'Birthdate is required').not().isEmail(),
    check('password', 'Please enter a password with 6 or more character').isLength({min: 6})
],async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    try {
    const {name, email, birthdate, password} = req.body ;
    let user = await User.findOne({email})
        if(user){
            return res.status(400).json({errors : [{msg : 'User already Exist'}]})
        }
        user = await User.create({
            name,
            email,
            password,
            birthdate,
        })
        
        createSendToken(user, res);

    }catch(err){
        console.error(err);
        res.status(500).send('Server Error')
    }
})



router.patch('/', [auth,
    check('email', 'Please include a valid email address').isEmail(),
    check('password', 'Password is requires').exists()
], async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    };
    
    try {
        const {email, password} = req.body ;
        let user = await User.findById(req.user.id)
            if(!user){
                return res.status(400).json({errors : [{msg : 'Invalid Credentials'}]})
            }

        const isMatch = await user.correctPassword(password, user.password);
        if(!isMatch){
            return res.status(400).json({errors : [{msg : 'Invalid Credentials'}]})
        }

        user.email = email;
        user.isVerified = false ;
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})


module.exports = router;