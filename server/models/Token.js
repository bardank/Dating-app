const mongoose = require('mongoose');
const tokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    verifyToken: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        require: true,
        default: Date.now(),
        expires: 43200
    }
})


module.exports = Token = mongoose.model('Token', tokenSchema);