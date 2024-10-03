const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()


const authMiddleware = (req, res, next) => {
    const token = req.header.token.split(' ')[1]
    jwt.verify(token, access_token, function (err, user) {
        if (err) {
            return res.status(404).json({
                status: 'Err',
                message: 'Bạn chưa đủ quyền truy nhập'
            })
        }
        if (user?.isAdmin) {
            next()
        } else {
            return res.status(404).json({
                status: 'Err',
                message: 'Bạn chưa đủ quyền truy nhập'
            })
        }
    });
}

const authUserMiddleware = (req, res, next) => {
    const token = req.header.token.split(' ')[1]
    const userId = req.params.id
    jwt.verify(token, access_token, function (err, user) {
        if (err) {
            return res.status(404).json({
                status: 'Err',
                message: 'Bạn chưa đủ quyền truy nhập'
            })
        }
        if (user?.isAdmin || user?.id === userId) {
            next()
        } else {
            return res.status(404).json({
                status: 'Err',
                message: 'Bạn chưa đủ quyền truy nhập'
            })
        }
    });
}

module.exports = {
    authUserMiddleware,
    authMiddleware
}