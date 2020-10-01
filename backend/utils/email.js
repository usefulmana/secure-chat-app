const nodemailer = require("nodemailer");
const { setKeyValue } = require('./redis');
const randomString = require('random-base64-string');

// if (process.env.NODE_ENV !== 'production') {
//     // Skip loading the .env file
//     require("dotenv").config();
// }

let transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,  
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PW,
  },
});

const sendEMail =  async (user, type) =>{

    const token = randomString(16);
    const payload = JSON.stringify({type: type, userId: user._id});
    setKeyValue(token, payload, 12*60*60);
    try {
      let info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: type === 'forgotpw'? 'Chattr - Recover your password': 'Welcome to Chattr - Please verify your email',
        html: `Click <a href='${process.env.CLIENT_URL}/forgot/${token}'> here</a>  to finish this action!`
    })

    console.log("Message sent: %s", info.messageId);

    }
    catch (err){
      console.log(err)
    }
}

module.exports = { sendEMail };