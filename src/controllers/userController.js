const userService = require('../services/userSevice');

const createUser = async (req, res) => {
    try {
        const { FullName, email, password, confirmPassword } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const checkEmail = reg.test(email)
        if (!FullName || !email || !password || !confirmPassword) {
            return res.status(200).json({
                status: "Err",
                message: "The input is required "
            })
        }
        else if (!checkEmail) {
            return res.status(200).json({
                status: "Err",
                message: "The input is email"
            })
        }
        else if (password !== confirmPassword) {
            return res.status(200).json({
                status: "Err",
                message: "The password is equal confirmPassword"
            })
        }
        const response = await userService.createUserService(req.body)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            status: "Err",
            message: e
        })
    }
}

const LoginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const checkUser = reg.test(username)
        if (!username || !password) {
            return res.status(200).json({
                status: "Err",
                message: "The input is required "
            })
        }
        else if (!checkUser) {
            return res.status(200).json({
                status: "Err",
                message: "The input is email"
            })
        }
        const response = await userService.loginUserService(req.body)
        const { refresh_token, ...newReponse } = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/',
        })
        return res.status(200).json({ ...newReponse, refresh_token })
    }
    catch (e) {
        return res.status(404).json({
            status: "Err",
            message: e
        })
    }
}
const refreshToken = async (req, res) => {
    try {
        let token = req.headers.token.split(' ')[1]
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsersService();
        return res.status(200).json({
            status: 'Success',
            data: users
        });
    } catch (e) {
        return res.status(404).json({
            status: 'Err',
            message: e.message
        });
    }
}
const getAllRoles = async (req, res) => {
    try {
        const roleUser = await userService.gettAllRoleService();
        return res.status(200).json({
            status: 'Success',
            data: roleUser
        });
    } catch (e) {
        return res.status(404).json({
            status: 'Err',
            message: e.message
        });
    }
}
const getUserInfo = async (req, res) => {
    try {
        const Id = req.params.Id;
        const account_id = req.account_id
        const userInfo = await userService.getUserInfoById(Id, account_id);

        return res.status(200).json({
            status: 'Success',
            data: userInfo
        });
    } catch (error) {
        return res.status(404).json({
            status: 'Err',
            message: error.message
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const Id = req.params.Id;
        const account_id = req.account_id
        const data = req.body;
        console.log('data', data)
        if (!Id) {
            return res.status(200).json({
                status: "Err",
                message: "The userId is require"
            })
        }
        const userUpdate = await userService.updateUserById(Id, data, account_id);

        return res.status(200).json({
            status: 'Success',
            data: userUpdate
        });
    } catch (error) {
        return res.status(404).json({
            status: 'Err',
            message: error.message
        });
    }
}

module.exports = {
    createUser,
    LoginUser,
    refreshToken,
    getAllUsers,
    getAllRoles,
    getUserInfo,
    updateUser
};