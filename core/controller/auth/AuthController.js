const bcrypt = require('bcryptjs');
const { User } = require('../../model/user.model');


async function login(req, res) {
    const { email, password,remember_me } = req.body;
    let code = 200;
    try {

        let user = await User.findOne({ email: new RegExp(email, 'i') }).select("+password");
        if (!user) {
            code = 401;
            return res.status(code).json({
                status: false,
                code: 401,
                message: 'invalid_email_or_password',
            })
        }
        let validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            code = 401;
            return res.status(code).json({
                status: false,
                code: 401,
                message: 'invalid_email_or_password',
            })
        }
        let token=user.generateAuthToken()
        if(remember_me){
            user.refresh_token=user.generateRefreshToken()
            user.save()
        }
        
        return res.status(code).json({
            status: true,
            code, token, user,
            message: "User login Successfully"
        })
    } catch (ex) {
        code = 500;
        return res.status(code).json({
            status: false, code,
            message: ex.message,
        })
    }

}


async function logout(req, res) {
try {
        let result = await User.findByIdAndUpdate(req.user._id, {
            $set: {
                refresh_token: null,
            }
        }, {new: true, select: "-password"})

        return res.status(200).json({
            status: true,
            code: 200,
            message: "logout successfully",
            user: result,
        });
    } catch (ex) {
        res.status(400).json({
            status: false,
            code: 400,
            message: ex.message,
        });
    }
}

async function getProfile(ctx) {
   try {
        const result = await User.findById(ctx.user.userId)
        ctx.status=200
        return ctx.body = {
            status: true,
            code: 200,
            message: "User fetched",
            user: result
        };
        if (!result) return ctx.body = {
            status: false,
            code: 404,
            message: "The User with the given ID was not found.",
        };
        

    } catch (ex) {
        ctx.status=500
        return ctx.body = {
            status: false,
            code: 500,
            message: ex.message,
        };
    }
}



module.exports.login = login
module.exports.logout = logout
module.exports.getProfile = getProfile