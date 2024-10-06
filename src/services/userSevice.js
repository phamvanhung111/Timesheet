const Users = require('../models/users');
const Accounts = require('../models/account')
const bcrypt = require('bcrypt');
const { refreshToken, accessToken } = require('./jwtService');

const createUserService = async (data) => {
    try {
        const {
            email,
            password,
            FullName,
            Age,
            Role,
            Bank,
            BankAccount,
            Address,
            Indentify,
            Salary,
            Sex,
            PhoneNumber
        } = data;
        console.log(data);

        // Kiểm tra email đã tồn tại hay chưa
        const userExists = await Accounts.findOne({ where: { UserName: email } });
        if (userExists) {
            return { status: 'Err', message: 'Email is already registered' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAccount = await Accounts.create({
            UserName: email,
            Password: hashedPassword,
        });
        const roleInt = parseInt(Role, 10);
        const newUser = await Users.create({
            FullName: FullName,
            Email: email,
            Age: Age,
            Role: roleInt,
            Account: newAccount.Id,
            Bank: Bank,
            BankAccount: BankAccount,
            Address: Address,
            Indentify: Indentify,
            Salary: Salary,
            Sex: Sex,
            PhoneNumber: PhoneNumber,
            Created: new Date(),
            Status: true // Đang hoạt động
        });

        if (newUser) {
            return {
                status: "Success",
                message: "Tạo thành công",
                data: newUser
            };
        }
    } catch (e) {
        console.log(e)
        return { status: "Err", message: e.message };
    }
};



const loginUserService = async (data) => {
    try {
        const { username, password } = data;
        // Kiểm tra xem email có tồn tại trong hệ thống hay không
        const account = await Accounts.findOne({ where: { UserName: username } });

        if (!account) {
            return { status: 'Err', message: 'Email or password is incorrect' };
        }

        // So sánh mật khẩu
        const isPasswordValid = await bcrypt.compare(password, account.Password);
        if (!isPasswordValid) {
            return { status: 'Err', message: 'Email or password is incorrect' };
        }
        const user = await Users.findOne({ where: { Account: account.Id } })
        const access_token = await accessToken({
            id: account.Id,
            email: account.UserName,
            role: user.Role
        });
        const refresh_token = await refreshToken({
            id: account.Id,
            email: account.UserName,
            role: user.Role
        });

        return { status: 'Success', accessToken: access_token, refreshToken: refresh_token, account };
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

const gettAllRoleService = async () => {
    try {
        const roleUsers = await Users.findAll();
        return roleUsers;

    } catch (error) {
        console.log(error)
        throw new Error(error.message);
    }
}
const getUserInfoById = async (Id, account_id) => {
    try {
        const userAccount = await Users.findOne({ where: { Account: account_id } });
        console.log("useracconut", typeof userAccount.Id)
        const intId = parseInt(Id, 10)
        console.log('id', typeof intId)
        if (userAccount.Id === intId) {
            const user = await Users.findOne({ where: { Id: intId } });
            console.log("user", user)
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        }
        else {
            return { message: 'Day k phai tk cua b' }
        }
    } catch (error) {
        throw new Error(error.message);
    }
};


module.exports = {
    createUserService,
    loginUserService,
    getAllUsersService,
    gettAllRoleService,
    getUserInfoById
};
