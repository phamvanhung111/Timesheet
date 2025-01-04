const Users = require('../models/users');
const Accounts = require('../models/account');
const Roles = require('../models/roles');
const bcrypt = require('bcrypt');
const ProjectUser = require('../models/projectUser');
const { refreshToken, accessToken } = require('./jwtService');
const sequelize = require('../config/database')
const { Op } = require('sequelize');
const createUserService = async (data) => {
    const transaction = await sequelize.transaction();
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
            PhoneNumber,
            Position
        } = data;

        const userExists = await Accounts.findOne({ where: { UserName: email } });
        if (userExists) {
            return { status: 'Err', message: 'Email đã được đăng ký' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAccount = await Accounts.create(
            {
                UserName: email,
                Password: hashedPassword,
            },
            { transaction }
        );

        const roleInt = parseInt(Role, 10);
        const newUser = await Users.create(
            {
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
                Position: Position,
                Created: new Date(),
                Status: true // Đang hoạt động
            },
            { transaction }
        );

        await transaction.commit();
        return {
            status: "Success",
            message: "Tạo thành công",
            data: newUser
        };

    } catch (e) {
        await transaction.rollback();
        console.log(e);
        return { status: "Err", message: e.message };
    }
};

const loginUserService = async (data) => {
    try {
        const { username, password } = data;
        const account = await Accounts.findOne({ where: { UserName: username } });

        if (!account) {
            return { status: 'Err', message: 'Email or password is incorrect' };
        }
        const isPasswordValid = await bcrypt.compare(password, account.Password);
        if (!isPasswordValid) {
            return { status: 'Err', message: 'Email or password is incorrect' };
        }
        const user = await Users.findOne({ where: { Account: account.Id } })
        console.log(user.Id)
        const access_token = await accessToken({
            id: user.Id,
            email: user.Email,
            role: user.Role
        });
        const refresh_token = await refreshToken({
            id: user.Id,
            email: user.Email,
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

const getAllUserInProjectService = async (projectId) => {
    try {
        const projectUsers = await ProjectUser.findAll({
            attributes: ['UserId'],
            where: { ProjectId: projectId }
        });

        // Lấy danh sách UserId từ kết quả
        const userIdsInProject = projectUsers.map(user => user.UserId);

        // Bước 2: Lấy FullName và Id của Users có UserId trong danh sách vừa tìm được
        const users = await Users.findAll({
            attributes: ['Id', 'FullName'],
            where: {
                Id: userIdsInProject // Lọc theo danh sách UserId
            }
        });

        return users;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getAllUserNotInProjectService = async (projectId) => {
    try {
        // Lấy tất cả UserId trong bảng ProjectUser cho ProjectId truyền vào
        const projectUsers = await ProjectUser.findAll({
            attributes: ['UserId'],
            where: { ProjectId: projectId }
        });

        // Lấy danh sách UserId từ kết quả
        const userIdsInProject = projectUsers.map(user => user.UserId);

        // Bước 2: Lấy FullName và Id của Users không có trong danh sách UserId
        const usersNotInProject = await Users.findAll({
            attributes: ['Id', 'FullName'],
            where: {
                Id: {
                    [Op.notIn]: userIdsInProject // Lọc người dùng không có trong danh sách UserId của dự án
                }
            }
        });

        console.log('Users not in project:', usersNotInProject);

        return usersNotInProject;
    } catch (error) {
        throw new Error(error.message);
    }
};

const gettAllRoleService = async () => {
    try {
        const roleUsers = await Roles.findAll();
        return roleUsers;

    } catch (error) {
        console.log(error)
        throw new Error(error.message);
    }
}
const getUserInfoById = async (user_id, role, UserId) => {
    try {
        const intUserId = parseInt(UserId, 10)
        console.log({ user_id, role, UserId })
        if (role !== 1 && intUserId !== user_id) {
            return {
                status: 'Err',
                message: 'You do not have permission to view requests of other users.'
            };
        }
        const getUserInfo = await Users.findAll({
            where: {
                Id: intUserId
            }
        })
        console.log(getUserInfo)
        return getUserInfo
    } catch (error) {
        throw new Error(error.message);
    }
};


const getUserInfoByEmailService = async (email) => {
    try {
        const userEmail = await Users.findOne({
            where: {
                Email: {
                    [Op.like]: `%${email}%` // Tìm kiếm email chứa chuỗi nhập vào
                }
            }
        });
        if (!userEmail) {
            throw new Error('User not found');
        }
        return userEmail;
    } catch (error) {
        throw new Error(error.message);
    }
};


const updateUserById = async (Id, data, user_id, role) => {
    try {
        const intUserId = parseInt(Id, 10)

        if (role !== 1 && intUserId !== user_id) {
            return {
                status: 'Err',
                message: 'You do not have permission to view requests of other users.'
            };
        }
        const userId = await Users.findOne({ where: { Id: intUserId } });
        if (userId === null) {
            return { status: 'Err', message: 'User not define' };
        }
        const {
            FullName,
            Age,
            Role,
            Bank,
            BankAccount,
            Address,
            Indentify,
            Salary,
            Sex,
            PhoneNumber,
            Position
        } = data;
        const updateUser = await Users.update({
            FullName: FullName,
            Age,
            Role,
            Bank,
            BankAccount,
            Address,
            Indentify,
            Salary,
            Sex,
            PhoneNumber,
            Position: Position
        }, {
            where: { Id: intUserId }
        });
        if (updateUser) {
            return {
                status: "Success",
                message: "Update thành công",
            };
        }
    }

    catch (error) {
        throw new Error(error.message);
    }
};




module.exports = {
    createUserService,
    loginUserService,
    getAllUsersService,
    gettAllRoleService,
    getUserInfoById,
    updateUserById,
    getUserInfoByEmailService,
    getAllUserNotInProjectService,
    getAllUserInProjectService 
};
