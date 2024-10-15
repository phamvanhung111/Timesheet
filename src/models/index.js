const sequelize = require('../config/database');
const Roles = require('./roles');
const Account = require('./account');
const Users = require('./users');
const Projects = require('./projects');
const Attendance = require('./attendance');
const Daily = require('./daily');
const RequestType = require('./requestType');
const Request = require('./request');
const ProjectUser = require('./projectUser');

const syncDatabase = async () => {
    try {
        // await sequelize.sync({ force: true });
        await sequelize.sync({ alter: true });
        console.log('Đã cập nhật cấu trúc bảng thành công!');
    } catch (error) {
        console.error('Lỗi khi cập nhật bảng:', error);
    }
};


syncDatabase();