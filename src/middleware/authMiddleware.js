const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()



const authMiddleware = (req, res, next) => {
    console.log(req.headers.token);

    // Lấy token từ header của yêu cầu
    const token = req.headers.token?.split(' ')[1];

    // Đảm bảo rằng token tồn tại
    if (!token) {
        return res.status(401).json({ // 401 Unauthorized
            status: 'Err',
            message: 'Token không hợp lệ'
        });
    }

    // Xác thực token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).json({ // 403 Forbidden
                status: 'Err',
                message: 'Bạn chưa đủ quyền truy nhập'
            });
        }

        // Kiểm tra xem token đã giải mã có chứa Role không
        if (decoded?.role === 1) {
            next(); // Người dùng có quyền truy cập
        } else {
            return res.status(403).json({ // 403 Forbidden
                status: 'Err',
                message: 'Bạn chưa đủ quyền truy nhập'
            });
        }
    });
}

// const authUserMiddleware = (req, res, next) => {
//     const token = req.headers.token.split(' ')[1]
//     const userId = req.params.id
//     jwt.verify(token, accessToken, function (err, user) {
//         if (err) {
//             return res.status(404).json({
//                 status: 'Err',
//                 message: 'Bạn chưa đủ quyền truy nhập'
//             })
//         }
//         if (user?.Role === 1 || user?.Id === userId) {
//             next()
//         } else {
//             return res.status(404).json({
//                 status: 'Err',
//                 message: 'Bạn chưa đủ quyền truy nhập'
//             })
//         }
//     });
// }
const authUserMiddleware = (req, res, next) => {
    const token = req.headers.token?.split(' ')[1]; // Lấy token từ header
    const userId = req.params.id; // Lấy userId từ tham số route

    // Đảm bảo rằng token tồn tại
    if (!token) {
        return res.status(401).json({ // 401 Unauthorized
            status: 'Err',
            message: 'Token không hợp lệ'
        });
    }

    // Xác thực token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).json({ // 403 Forbidden
                status: 'Err',
                message: 'Bạn chưa đủ quyền truy nhập'
            });
        }

        // Kiểm tra xem decoded?.Id có khác null không
        if (decoded?.Role === 1 || decoded?.Id !== null) {
            next(); // Người dùng có quyền truy cập
        } else {
            return res.status(403).json({ // 403 Forbidden
                status: 'Err',
                message: 'Bạn chưa đủ quyền truy nhập'
            });
        }
    });
}

module.exports = {
    authUserMiddleware,
    authMiddleware
}


module.exports = {
    authUserMiddleware,
    authMiddleware
}