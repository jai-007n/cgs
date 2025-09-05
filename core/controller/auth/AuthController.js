const bcrypt = require('bcryptjs');
const { User, validatePassword } = require('../../model/user.model');
const errorBag = require('../../utility/common');

async function login(req, res) {
    const { email, password, remember_me } = req.body;
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
        let token = user.generateAuthToken()
        if (remember_me) {
            user.refresh_token = user.generateRefreshToken()
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
        await User.findOneAndUpdate({ _id: req.user._id },
            [{
                $set: {
                    freshLogin: { $not: "$freshLogin" },
                    refresh_token: null
                }
            }])

        return res.status(204).json({
            status: true,
            code: 204,
            message: "logout successfully",
        });
    } catch (ex) {
        return res.status(500).json({
            status: false,
            code: 500,
            message: ex.message,
        });
    }
}

async function getProfile(req, res) {
    try {
        const user = await User.findById(req.user?._id)
        let code = 200
        return res.status(code).json({
            status: true,
            code, user,
            message: "User profile !",
        });
    } catch (ex) {
        return res.status(500).json({
            status: false,
            code: 500,
            message: ex.message,
        });
    }
}

async function updateProfile(req, res) {
    let { error } = validatePassword(req.body);
    if (error) return res.status(422).send(errorBag(error));

    let userExist = await User.findById(req.user._id)
    if (!userExist) {
        return res.status(404).json({
            status: false,
            code: 404,
            message: "No user find for given Id.",
        });
    }

    const { name, password } = req.body
    if (password !== '' && password !== null)
        userExist.password = password;
    userExist.name = name
    // userExist.freshLogin = !userExist.freshLogin
    await userExist.save()

    return res.status(200).json({
        status: true,
        code: 200,
        message: "Profile update successfully.",
        user: userExist,
    });
}



module.exports.login = login
module.exports.logout = logout
module.exports.getProfile = getProfile
module.exports.updateProfile = updateProfile