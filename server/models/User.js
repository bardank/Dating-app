const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number
    },
    avatar: {
        type: String
    },
    birthdate: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String,
        required: false
    },

    resetPasswordExpires: {
        type: Date,
        required: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    passwordChangeAt: Date
})

userSchema.pre('save', async function(next) {
    const user = this;

    if (!user.isModified('password')) return next();

    const salt  = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt);

    next()
});
userSchema.pre('save', async function(next) {

    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangeAt = Date.now() - 1000 ;
    next()

    
});

userSchema.methods.correctPassword = async function(candidatePass, userPass){
    return await bcrypt.compare(candidatePass, userPass)
}

userSchema.methods.changedPasswordAfter =  function(JWTTimestamp){
    if(this.passwordChangeAt){
        const changedTimeStamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimeStamp
    }
    return false
}


userSchema.methods.generatePasswordReset =  function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpires = Date.now() + 360000
    return resetToken ;
};


module.exports = User = mongoose.model('User', userSchema)