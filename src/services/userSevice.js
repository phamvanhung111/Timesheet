// const User = require("../models/UserModel");
// const bcrypt = require('bcrypt');
// const { refreshToken, accessToken } = require('./jwtService')

// const createUserService = async (newUser) => {
//     return new Promise(async (resolve, reject) => {
//         const { name, email, password, confirmPassword, phone } = newUser;
//         try {
//             // check email ton tai hay chua
//             const checkUser = await User.findOne({ email: email })
//             if (checkUser !== null) {
//                 resolve({
//                     status: "Err",
//                     message: "Email đã tồn tại"
//                 })
//             }
//             // Hashpassword : tăng bảo mật
//             const hash = bcrypt.hashSync(password, 10);

//             // tạo user
//             const createUser = await User.create({
//                 name,
//                 email,
//                 password: hash,
//                 phone
//             })

//             if (createUser) {
//                 resolve({
//                     status: "Success",
//                     message: "Tạo thành công",
//                     data: createUser
//                 }
//                 )
//             }
//         }
//         catch (e) {
//             reject(e)
//         }
//     })
// }
// const loginUserService = async (loginUser) => {
//     return new Promise(async (resolve, reject) => {
//         const { email, password } = loginUser;
//         try {
//             const checkUser = await User.findOne({ email: email });

//             // check user có trong database hay k
//             if (checkUser == null) {
//                 resolve({
//                     status: 'ERR',
//                     message: 'Email không tồn tại'
//                 })
//             } const confirmPassword = bcrypt.compareSync(password, checkUser.password);
//             if (!confirmPassword) {
//                 resolve({
//                     status: 'ERR',
//                     message: 'Mật khẩu không chính xác '
//                 })
//             }
//             const access_token = await accessToken({
//                 id: checkUser.id,
//                 isAdmin: checkUser.isAdmin
//             })
//             const refresh_token = await refreshToken({
//                 id: checkUser.id,
//                 isAdmin: checkUser.isAdmin
//             })
//             resolve({
//                 status: 'OK',
//                 message: 'Đăng nhập thành công',
//                 access_token,
//                 refresh_token
//             })

//         } catch (e) {
//             reject(e)
//         }

//     })
// }




// module.exports = {
//     createUserService,
//     loginUserService
// }