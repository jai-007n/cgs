const express = require('express');
const router = express.Router({ caseSensitive: true });
const {defaultRoutes} = require('./default.routes')
const routeConfig=require('../lib/routes.config')

router.get("/hello", function (req, res) {

    res.status(200).json({
        success: true,
        msg: "Successfully test."
    })
});


if (routeConfig.default) {
    console.log("default routes calling")
    defaultRoutes(router);
}


module.exports = router