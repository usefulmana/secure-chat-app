const nodemailer = require("nodemailer");
const { setKeyValue } = require('./redis');
const randomString = require('random-base64-string');


// Configure Node Mailer
let transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,  
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PW,
  },
});


// Send Email
const sendEMail =  async (user, type) =>{
    // Generate a token
    const token = randomString(16);
    const payload = JSON.stringify({type: type, userId: user._id});
    setKeyValue(token, payload, 12*60*60);

    // Try Sending the Email
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