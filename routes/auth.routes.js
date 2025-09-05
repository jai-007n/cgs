const express = require('express');
const authRouter = express.Router();
const guestRouter = express.Router();
const loginObject = require('../core/controller/auth/AuthController');
const auth = require('../core/middleware/auth');
module.exports.authRoutes = (router) => {

    router.use('/auth', guestRouter);
    router.use('/auth',auth, authRouter);

    // login route
    guestRouter.post('/login', loginObject.login);

    // logout route
    authRouter.get('/logout', loginObject.logout);

    // login user profile route
    authRouter.route('/profile')
        .get(loginObject.getProfile)
        .post(loginObject.updateProfile);

    // login user profile update route
    // authRouter.post('/profile', loginObject.updateProfile);
};

