
const nodemailer = require('nodemailer');


const sendEmail = async (to, subject, htmlContent) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
     user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS  
    }
  });

  const mailOptions = {
    from: "rohitvarpe1340@gmail.com",
    to: to,
    subject: subject,
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};



module.exports = sendEmail;
