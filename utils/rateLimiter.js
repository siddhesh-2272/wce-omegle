const rateLimit = require('express-rate-limit');

// Rate Limiter
const getLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 1 hour window
    max: 50, // start blocking after 5 requests
    message:'Too many login attempts from this IP, please try again after an hour'
});

const postLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 1 hour window
    max: 20, // start blocking after 5 requests
    message:'Too many login attempts from this IP, please try again after an hour'
});

const getVerifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 1 hour window
    max: 50, // start blocking after 5 requests
    message:'Too many verification attempts from this IP, please try again after an hour'
});

const postVerifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 1 hour window
    max: 20, // start blocking after 5 requests
    message:'Too many verification attempts from this IP, please try again after an hour'
});

module.exports = {
    getLoginLimiter,
    postLoginLimiter,
    getVerifyLimiter,
    postVerifyLimiter
}
