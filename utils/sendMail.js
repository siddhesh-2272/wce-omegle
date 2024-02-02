const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendMail = async (toMail,otp) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `${process.env.EMAIL}`,
            pass: `${process.env.PASSWORD}`
        }
    });

    // Define the email options
    const mailOptions = {
        from: `${process.env.EMAIL}`,
        to: `${toMail}`,
        subject: `Your one time password for WCE-Omegle`,
        text: `Your one time password is ${otp}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error.message);
            return false;
        } else {
            return true;
        }
    });

};

module.exports = sendMail;
