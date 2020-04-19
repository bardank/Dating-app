const express = require('express');
const router =  express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require("express-validator");
const createSendToken = require('../../utils/authController');

// api/auth/

router.get('/', auth, async(req, res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user);
        
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

router.post('/', [
    check('email', 'Please include a valid email address').isEmail(),
    check('password', 'Password is requires').exists()
],async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    try {
        const {email, password} = req.body ;
        let user = await User.findOne({email})
            if(!user){
                return res.status(400).json({errors : [{msg : 'Invalid Credentials'}]})
            }

        const isMatch = await user.correctPassword(password, user.password)

        if(!isMatch){
            return res.status(400).json({errors : [{msg : 'Invalid Credentials'}]})
        }
        createSendToken(user, res);

    }catch(err){
        console.error(err.message);
        res.status(500).json({errors : [{msg : 'Server Error'}]})
    }
})

module.exports = router;