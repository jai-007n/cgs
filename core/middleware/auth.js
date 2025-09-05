const jwt = require('jsonwebtoken');
const config = require('config');
const {User} = require('../model/user.model');

module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token');
   
    if (!token) return res.status(401).json({
        status: false,
        code: 401,
        message: "unauthenticated user"
    })

    try {
        req.user = jwt.verify(token, config.get('JWT_PRIVATE_KEY'));
        const userActive = await User.findById(req.user._id)
         console.log(req.user,req.user?.freshLogin !== userActive?.freshLogin)
        if (req.user?.freshLogin !== userActive?.freshLogin) {
            return res.status(401).json({
                status: false,
                code: 401,
                message: "unauthenticated user"
            })
        }
        next();
    } catch (ex) {
        return res.status(401).json({
            status: false,
            code: 401,
            message: req.t("invalid_token"),
        })
    }

}