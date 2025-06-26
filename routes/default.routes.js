const express = require('express');
const defaultRouter = express.Router();

module.exports.defaultRoutes = (router) => {
    
    router.use('/', defaultRouter);

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

    // // Catch all 404 not found route
    // defaultRouter.all('*', (req, res) => {
    //     const code = 404;
    //     return res.status(code).json({
    //         code,
    //         message: `${req.url} not found`
    //     });
    // });
};

