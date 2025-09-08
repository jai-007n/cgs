const jwt = require('jsonwebtoken');
const { jwtDecode } = require('jwt-decode');
const config = require('config');
const { User } = require('../model/user.model');

module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) return res.status(401).json({
        status: false,
        code: 401,
        message: "Unauthenticated user"
    })
          
    try {
        req.user = jwt.verify(token, config.get('JWT_PRIVATE_KEY'));
        const userActive = await User.findById(req.user._id)

        if (req.user?.freshLogin !== userActive?.freshLogin) {
            return res.status(401).json({
                status: false,
                code: 401,
                message: "Unauthenticated user"
            })
        }
        next();
    } catch (ex) {
        if (ex.name === 'TokenExpiredError') {
            const decodedToken = jwtDecode(token);
            const userActive = await User.findById(decodedToken._id)
            if (userActive?.refresh_token) {
                try {
                    const decoded = jwt.verify(userActive.refresh_token, config.get('JWT_PRIVATE_REFRESH_KEY'));
                    // In a real application, you would also check if this refresh token
                    // is valid in your database (e.g., not revoked, associated with the user).
                    const token = userActive.generateAuthToken();
                    // Optional: Generate a new refresh token (rolling refresh)
                    const newRefreshToken = userActive.generateRefreshToken();
                    userActive.refresh_token = newRefreshToken;
                    userActive.save();

                    return res.status(401).json({
                        status: true,
                        isNewToken:true,
                        code: 401,token,
                        message: "Token Refreshed"
                    })
                } catch (error) {
                    return res.status(401).json({
                        status: false,
                        code: 401,
                        message: "Invalid Token or expired R",
                    })
                }
            }
        }
        return res.status(401).json({
            status: false,
            code: 401,
            message: "Invalid Token or expired",
        })
    }

}