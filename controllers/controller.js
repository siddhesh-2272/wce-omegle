const dotenv = require('dotenv');
dotenv.config();
const sendMail = require('../utils/sendMail.js');
const generateOTP = require('../utils/generateOTP.js');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const path = require('path');
const publicDirectory = path.join(__dirname, '../public');
const isValidMail = require('../utils/isValidMail.js');

const getHomePage = (req, res) => {
    return res.sendFile('/index.html');
}

const getAboutPage = (req, res) => {
    return res.sendFile('/about.html');
}

const getLoginPage = (req, res) => {
    try {
        const loginPage = path.join(publicDirectory, 'login.html');
        return res.sendFile(loginPage);
    } catch (error) {
        return res.send(error.message);
    }
}

const getVerifyPage = (req, res) => {
    try {
        const verifyPage = path.join(publicDirectory, 'verify.html');
        return res.sendFile(verifyPage);
    } catch (error) {
        return res.send(error.message);
    }
}

const postLoginPage = async(req, res) => {
    try {
        const { email } = req.body;
        const isValid = isValidMail(email);
        // console.log("isValid", isValid);
        if(!isValid) {
            // console.log("Invalid email");
            return res.redirect('/login');
        }
        // console.log("Valid email");
        const otp = await generateOTP();
        const otpExpiresIn = Date.now() + 5*60*1000;
        const u = jwt.sign({email, verified: false}, process.env.JWT_SECRET);
        const mailSent = await sendMail(email, otp);
        const user = await User.findOneAndUpdate({
            email: email
        },
        {
            $set: {
                otp: otp,
                otpExpiresIn: otpExpiresIn
            },
        },
        { upsert: true, new: true });
        res.cookie('u', u, { httpOnly: true, maxAge: 5 * 60 * 1000 });
        return res.redirect('/verify');
    } catch (error) {
        console.log("Post Login:", error.message);
        return res.send(error.message);
    }
}

const postVerifyPage = async(req, res) => {
    try {
        const {otp} = req.body;
        const token = req.cookies?.u || req.header("Authorization")?.replace("Bearer ", "");
        const decodedU = jwt.verify(token, process.env.JWT_SECRET);
        const {email} = decodedU;
        let user = await User.findOne({
            email: email,
        });
        const isValidOTP = user && Number(otp) === Number(user.otp);
        const isExpired = Date.now() > user.otpExpiresIn;
        if(!isValidOTP) {
            return res.redirect('/verify');
        }
        if(isExpired) {
            user = await User.findOneAndUpdate({
                email: email
            },
            {
                $set: {
                    otp: null,
                    otpExpiresIn: null
                },
            },
            { upsert: true, new: true });
            return res.redirect('/login');
        }
        decodedU.verified = true;
        const u = jwt.sign({email, verified: true}, process.env.JWT_SECRET);
        res.cookie('u', u, {httpOnly: true});
        return res.redirect('/chat');
    } catch (error) {
        console.log("Post verify", error.message);
        return res.send(error.message);
    }
}

const getChatPage = (req, res) => {
    try {
        const chatPage = path.join(publicDirectory, 'chat.html');
        return res.sendFile(chatPage);
    } catch (error) {
        return res.send(error.message);
    }
}

const getLogout = (req, res) => {
    try {
        res.clearCookie('u');
        return res.redirect('/login');
    } catch (error) {
        return res.send(error.message);
    }
}


module.exports = {
    getHomePage,
    getAboutPage,
    getLoginPage,
    getVerifyPage,
    postLoginPage,
    postVerifyPage,
    getChatPage,
    getLogout
};