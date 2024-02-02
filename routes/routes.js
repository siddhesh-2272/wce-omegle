const express = require('express');
const router = express.Router();
const {
    authMiddleware1,
    authMiddleware2,
    authMiddleware3
} = require('../middlewares/auth.js');   
const {
    getHomePage,
    getAboutPage,
    getLoginPage,
    getVerifyPage,
    postLoginPage,
    postVerifyPage,
    getChatPage,
    getLogout
} = require('../controllers/controller.js');

const {
    getLoginLimiter,
    postLoginLimiter,
    getVerifyLimiter,
    postVerifyLimiter
} = require('../utils/rateLimiter.js');

router.get('/', getHomePage);

router.get('/about', getAboutPage);

router.get('/login', getLoginLimiter,authMiddleware3, getLoginPage);

router.post('/login', postLoginLimiter,authMiddleware3, postLoginPage);

router.get('/verify',getVerifyLimiter,authMiddleware1, getVerifyPage);

router.post('/verify',postVerifyLimiter, authMiddleware1, postVerifyPage);

router.get('/chat', authMiddleware2, getChatPage);

router.get('/health', (req, res) => {
    return res.status(200).send("OK");
});

router.get('/logout', getLogout);


module.exports = router;