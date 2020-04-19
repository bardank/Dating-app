const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const sendMail = require ('../../utils/mail');
const crypto = require('crypto');
const auth = require('../../middleware/auth');
const jwt  = require('jsonwebtoken');
const createSendToken = require('../../utils/authController');
const {check, validationResult} = require("express-validator");

router.post('/forgotpassword',[
    check('email', 'Please include a valid email address').isEmail(),

], async(req, res)=>{
    try {
        const user = await User.findOne({email :  req.body.email}).select('-password');
        if(!user){
            return res.status(400).json({errors : [{msg : 'User does not exists. Please, double check the email address'}]})
        }
        const resetToken = user.generatePasswordReset();
        await user.save({validateBeforeSave: false})

        const verifyURL = `${req.protocol}:localhost:3000/app/resettoken/${resetToken}` ;
        const message = `Forgot your password ? Please click the link below to reset the password  \n ${verifyURL} \n If you didn't forgot your password, please ignore this emial!` ;

        await sendMail({
            email: user.email,
            subject: "Verify your email",
            text: message
        })
        res.json(`Password reset email has been sent to ${user.email}. Please check your email`)
        

    } catch (err) {
        user.resetPasswordToken = undefined ;
        user.resetPasswordExpires= undefined;
        await user.save({validateBeforeSave: false})

        console.error(err.message);
        res.status(500).send('Server Error')
    }

});
router.get('/reset/:resetToken', async(req, res)=>{
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
        const user = await User.findOne({resetPasswordToken: hashedToken, resetPasswordExpires: {$gt : Date.now()}})
        if(!user){
            return res.status(400).json({errors : [{msg : 'Token is invalid or expired'}]})
        }

        res.json('valid token')

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
    
});

router.patch('/resetpassword/:resetToken', [
    check('password', 'Please enter a password with 6 or more character').isLength({min: 6})
],async(req, res)=>{
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
        const user = await User.findOne({resetPasswordToken: hashedToken, resetPasswordExpires: {$gt : Date.now()}})
        if(!user){
            return res.status(400).json({errors : [{msg : 'Token is invalid or expired'}]})
        }
        user.password = req.body.password ;
        user.resetPasswordToken = undefined ;
        user.resetPasswordExpires = undefined;

        await user.save()
        createSendToken(user, res);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
    
});

router.patch('/updatepassword', [auth,
    check('currentPassword', 'Please enter your current password').isLength({min: 6}),
    check('newPassword', 'Please enter new password with 6 or more character').isLength({min: 6})
], async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
        const {currentPassword , newPassword} = req.body
    try {

        let user = await User.findById(req.user.id);
        const isMatch = await user.correctPassword(currentPassword, user.password)
        if(!isMatch){
            return res.status(401).json({error : [{msg: 'Incorrect password'}]})
        }
        user.password = newPassword
        await user.save()
        
        createSendToken(user, res);
        
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
}) 



module.exports = router;