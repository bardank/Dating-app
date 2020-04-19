const nodemailer = require('nodemailer');

const sendMail = async options =>{
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth:{
                user: process.env.EMAIL_USERNAME ,
                pass: process.env.EMAIL_PASSWORD
            }
        })
        
        const mailOptions = {
            from : '"Kta kti" <kta@kti.com>',
            to: options.email,
            subject: options.subject,
            text: options.text
            // html:
        }
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
          })
        
    } catch (err) {
        console.error(err.message);
       
    }
};

module.exports = sendMail