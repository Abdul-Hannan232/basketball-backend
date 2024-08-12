const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    // port: 465,
    port: 587,
    security: false,
    auth: {
        user: process.env.TRANSPORTER_USER, 
        pass: process.env.TRANSPORTER_PASS, 
    },
    requireTLS: true 
});

const forgotPasswordMail = async (mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        return 'Email sent successfully';
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // or handle it as you see fit
    }
};

module.exports = {
    forgotPasswordMail
};
