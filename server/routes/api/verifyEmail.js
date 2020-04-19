const express = require('express');
const router =  express.Router();
const randomstring = require('randomstring');
const Token = require('../../models/Token');
const sendMail = require ('../../utils/mail');
const auth = require('../../middleware/auth');
const User = require('../../models/User');

router.get('/', auth, async(req, res)=>{
    try {
        await Token.findOneAndRemove({user: req.user.id})

        const generateToken =  randomstring.generate({
            length: 5,
            charset: 'numeric'
          });
        const verifyToken = await new Token({verifyToken: generateToken, user: req.user.id})
        await verifyToken.save();
        
        const verifyURL = `${req.protocol}://${req.get('host')}/api/verify/${generateToken}` ;
        const message = `Please verify your email address. Click the link below to verify the emial addreess \n ${verifyURL}` ;
        const user = await User.findById(req.user.id)

        await sendMail({
            email: user.email,
            subject: "Verify your email",
            text: message
        })
        res.json(`Email has been sent to ${user.email}. Please check your email`)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

router.get('/:token', auth, async(req, res)=>{
    try {
        const token = await Token.find({verifyToken: req.params.token})
        if(!token){
            return res.status(400).json({errors : [{msg : 'Verification token expired please send the verification code again'}]})
        }
        const user = await User.findById(req.user.id)
        user.isVerified = true
        await user.save();
        res.json('user verified')
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

module.exports = router



