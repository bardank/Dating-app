const uuid = require('uuid')

//IMAGE UPLOAD CONFIGURATION
const multer = require('multer');
const storage = multer.diskStorage({
    filename: function(req, file, callback) {
    callback(null, uuid.v4() + file.originalname);
    }
    });

module.exports = storage


// const cloudinary = require("cloudinary");
// cloudinary.config({
// cloud_name: process.env.CLOUD_NAME, //ENTER YOUR CLOUDINARY NAME
// api_key: process.env.CLOUDINARY_API_KEY, // THIS IS COMING FROM CLOUDINARY WHICH WE SAVED FROM EARLIER
// api_secret: process.env.CLOUDINARY_API_SECRET // ALSO COMING FROM CLOUDINARY WHICH WE SAVED EARLIER
// });
