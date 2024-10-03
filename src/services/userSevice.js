const Users = require('../models/Users'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 

const createUserService = async (data) => {
    try {
        const {
            email,
            password,
            FullName,
            Age,
            Role,
            Account,
            Bank,
            BankAccount,
            Address,
            Indentify,
            Salary,
            Sex,
            PhoneNumber
        } = data;
        
        // Kiểm tra email đã tồn tại hay chưa
        const userExists = await Users.findOne({ where: { Email: email } });
        if (userExists) {
            return { status: 'Err', message: 'Email is already registered' };
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới với tất cả các trường
        const newUser = await Users.create({
            FullName,
            Email: email,
            Password: hashedPassword,
            Age,
            Role,
            Account,
            Bank,
            BankAccount,
            Address,
            Indentify,
            Salary,
            Sex,
            PhoneNumber,
            Created: new Date(),
            Status: true // Đang hoạt động
        });

        return { status: 'Success', data: newUser };
    } catch (error) {
        throw new Error(error.message);
    }
};


const loginUserService = async (data) => {
    try {
        const { email, password } = data;

        // Kiểm tra xem email có tồn tại trong hệ thống hay không
        const user = await Users.findOne({ where: { Email: email } });
        if (!user) {
            return { status: 'Err', message: 'Email or password is incorrect' };
        }

        // So sánh mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (!isPasswordValid) {
            return { status: 'Err', message: 'Email or password is incorrect' };
        }

        // Tạo JWT token
        const accessToken = jwt.sign(
            { id: user.Id, email: user.Email },
            process.env.JWT_SECRET, // Khóa bí mật để tạo token (bạn cần định nghĩa trong .env)
            { expiresIn: '1h' } // Token hết hạn sau 1 giờ
        );
        
        const refreshToken = jwt.sign(
            { id: user.Id, email: user.Email },
            process.env.JWT_REFRESH_SECRET, // Khóa bí mật để tạo refresh token
            { expiresIn: '7d' } // Refresh token hết hạn sau 7 ngày
        );

        return { status: 'Success', access_token: accessToken, refresh_token: refreshToken, user };
    } catch (error) {
        throw new Error(error.message);
    }
};

const getAllUsersService = async () => {
    try {
        const users = await Users.findAll(); // Lấy tất cả người dùng từ cơ sở dữ liệu
        return users;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createUserService,
    loginUserService,
    getAllUsersService
};
