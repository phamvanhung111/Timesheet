const userService = require('../services/userSevice');
const roleService = require('../services/roleService');
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
                status: "Err1",
                message: "The input is email"
            })
        }
        else if (password !== confirmPassword) {
            return res.status(200).json({
                status: "Err2",
                message: "The password is equal confirmPassword"
            })
        }
        const response = await userService.createUserService(req.body)
        return res.status(200).json(response)
    }
    catch (e) {
        console.log(e)
        return res.status(404).json({
            status: "Err3",
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
        const UserId = req.params.Id;
        const user_id = req.user_id;
        const role = req.role;
        const userInfo = await userService.getUserInfoById(user_id, role, UserId);

        return res.status(200).json({
            status: 'Success',
            data: userInfo
        });
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            status: 'Err',
            message: error.message
        });
    }
};

const getUserInfoByEmail = async (req, res) => {
    try {
        const email = req.body.email
        const emailUser = await userService.getUserInfoByEmailService(email);
        return res.status(200).json({
            status: 'Success',
            data: emailUser
        });
    } catch (e) {
        return res.status(404).json({
            status: 'Err',
            message: e.message
        });
    }
}


const updateUser = async (req, res) => {
    try {
        const role = req.role
        const Id = req.params.Id;
        const user_id = req.user_id
        const data = req.body;
        console.log('data', data)
        if (!Id) {
            return res.status(200).json({
                status: "Err",
                message: "The userId is require"
            })
        }
        const userUpdate = await userService.updateUserById(Id, data, user_id, role);

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


const createRole = async (req, res) => {
    try {
        const createRole = req.body;
        const response = await roleService.createRoleService(createRole)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            status: "Err",
            message: e
        })
    }
}

module.exports = {
    createUser,
    LoginUser,
    refreshToken,
    getAllUsers,
    getAllRoles,
    getUserInfo,
    updateUser,
    getUserInfoByEmail,
    createRole
};