const express = require('express');
const { LocalLogger } = require("./../core/utility/logger.js");
const defaultRouter = express.Router();

module.exports.defaultRoutes = (router) => {

    router.use('/', defaultRouter);

    // hello test
    router.get("/hello", function (req, res) {
        res.status(200).json({
            success: true,
            msg: "Successfully test."
        })
    });

    defaultRouter.get('/ping', (req, res) => {
        console.log(`ℹ️ - Ping route: ${req.url} ${Date.now()}`);
        res.status(200).json({
            message: '✅ - Pong: test successfully'
        });
    });

    // Catch all route for the ping (only allow get)
    defaultRouter.all('/ping', (req, res) => {
        const code = 405;
        return res.status(code).json({
            code,
            message: `${req.method} method not allowed for route ${req.url}`
        });
    });

    // check for the logger class is working or not
    defaultRouter.get('/logger', (req, res) => {
        const code = 405;
        const logger = new LocalLogger(
            'Default',
            'Default otp logger'
        );
        return res.status(code).json({
            code,
            message: `${req.method} method not allowed for route ${req.url}`,
            logMessage: logger
        });

    });

    // // Catch all 404 not found route
    // defaultRouter.all('*', (req, res) => {
    //     const code = 404;
    //     return res.status(code).json({
    //         code,
    //         message: `${req.url} not found`
    //     });
    // });
};

