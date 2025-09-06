const express = require('express');
const router = express.Router({ caseSensitive: true });
const { defaultRoutes } = require('./default.routes')
const { authRoutes } = require('./auth.routes')
const { clientRoutes } = require('./client.routes')
const routeConfig = require('../lib/routes.config')


if (routeConfig.default) {
    defaultRoutes(router);
}
if (routeConfig.auth) {
    authRoutes(router);
}
if (routeConfig.client) {
    clientRoutes(router);
}


module.exports = router