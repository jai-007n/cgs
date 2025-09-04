const express = require('express');
const router = express.Router({ caseSensitive: true });
const { defaultRoutes } = require('./default.routes')
const { authRoutes } = require('./auth.routes')
const routeConfig = require('../lib/routes.config')


if (routeConfig.default) {
    console.log("default routes calling")
    defaultRoutes(router);
}
if (routeConfig.auth) {
    console.log("auth routes calling")
    authRoutes(router);
}


module.exports = router