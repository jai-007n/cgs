const express = require('express');
const authRouter = express.Router();
const loginObject = require('../core/controller/auth/AuthController');
module.exports.authRoutes = (router) => {

    router.use('/auth', authRouter);

    // login route
    authRouter.post('/login', loginObject.login);

    // logout route
    authRouter.get('/logout', loginObject.logout);

    // login user profile route
    authRouter.get('/profile', loginObject.getProfile);
};

