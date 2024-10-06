const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Users = require('../models/users'); // Đảm bảo đường dẫn đúng
const Account = require('../models/account');

dotenv.config();

const accessToken = async (payload) => {
    console.log('payload: ', payload);
    try {
        const access_token = jwt.sign(
            {
                id: payload.id,
                email: payload.email,
                role: payload.role
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' } // Đặt thời gian hết hạn token
        );
        return access_token;
    } catch (error) {
        console.error('Error creating access token:', error);
    }
}


const refreshToken = async (payload) => {
    try {
        const refresh_token = jwt.sign(
            {
                id: payload.id,
                email: payload.email,
                role: payload.role
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '365d' } // Token sẽ có thời hạn 365 ngày
        );
        return refresh_token;
    } catch (error) {
        console.error('Error creating refresh token:', error);
    }
}



const refreshTokenJwtService = async (token) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, account) => {
                if (err) {
                    return resolve({
                        status: 'ERR',
                        message: 'Token không hợp lệ hoặc đã hết hạn'
                    });
                }

                // Tìm người dùng trong cơ sở dữ liệu
                const existingAccount = await Account.findOne({ where: { Id: account.Id } });
                if (!existingAccount) {
                    return resolve({
                        status: 'ERR',
                        message: 'Người dùng không tồn tại'
                    });
                }
                const existingUser = await Users.findOne({ where: { Email: existingAccount.UserName } });
                const access_token = await accessToken({
                    id: existingUser.Id,
                    isAdmin: existingUser.Role === 1
                });

                resolve({
                    status: 'OK',
                    message: 'Cấp lại token thành công',
                    access_token
                });
            });
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    refreshToken,
    accessToken,
    refreshTokenJwtService
}