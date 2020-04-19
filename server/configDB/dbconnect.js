require('dotenv').config()
const mongoose = require('mongoose');

const db = async ()=> {
    try {
        await mongoose.connect(process.env.MONGO_BD_LOCAL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
        console.log("mongodb connected")
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
};

module.exports = db ;