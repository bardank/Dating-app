const jwt = require('jsonwebtoken');
const User = require('../models/User')

module.exports = async function(req, res, next){
    const token = req.header('x-auth-token')
    if(!token){
        return res.status(401).json({msg: "No token, Authorization denied"})
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded.user ;
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(401).json({msg: "No token, Authorization denied"})
        }
        if(user.changedPasswordAfter(decoded.iat)){
            return res.status(401).json({msg: "Password has recently been chnage"})
        }
        next();
    }catch (error) {
        res.status(401).json({msg: 'Token not valid'})
    }
}