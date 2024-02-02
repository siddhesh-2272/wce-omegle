const jwt = require('jsonwebtoken');
require('dotenv').config();
const authMiddleware1 = (req, res, next) => {
    try {
        const u = req.cookies?.u || req.header("Authorization")?.replace("Bearer ", "");
        if (!u) {
            return res.redirect('/login');
        }
        const {email, verified} = jwt.verify(u, process.env.JWT_SECRET);
        req.email = email;
        req.verified = verified;
        if(verified){
            return res.redirect('/chat');
        }
        next();
    } catch (error) {
        return res.send(error.message);
    }
};

const authMiddleware2 = (req, res, next) => {
    try {
        const u = req.cookies?.u || req.header("Authorization")?.replace("Bearer ", "");
        if (!u) {
            return res.redirect('/login');
        }
        const {email, verified} = jwt.verify(u, process.env.JWT_SECRET);
        req.email = email;
        req.verified = verified;
        if(!verified){
            return res.redirect('/verify');
        }
        next();
        
    } catch (error) {
        return res.send(error.message);
    }
};

const authMiddleware3 = (req, res, next) => {
    try {
        const u = req.cookies?.u || req.header("Authorization")?.replace("Bearer ", "");
        if (u) {
            const {email, verified} = jwt.verify(u, process.env.JWT_SECRET);
            req.email = email;
            req.verified = verified;
            if(!verified){
                return res.redirect('/verify');
            }
            else {
                return res.redirect('/chat');
            } 
        }
        return next();
        
    } catch (error) {
        return res.send(error.message);
    }
};

module.exports = {
    authMiddleware1,
    authMiddleware2,
    authMiddleware3
};
