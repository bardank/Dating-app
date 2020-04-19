const jwt = require('jsonwebtoken');

const createSendToken = (user, res)=>{

    const payload  ={
        user :{
            id: user.id
        }
    }
    user.password = undefined
    jwt.sign(payload, process.env.JWT_SECRET , {expiresIn: process.env.JWT_EXPIRES}, (err, token)=>{
        if(err){
            throw err
        }
        res.json(token)
        // res.json({
        //     token,
        //     // date: user
        // })
    })

}



module.exports = createSendToken