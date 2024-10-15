const Daily = require('../models/daily');
const Projects = require('../models/projects')
const ProjectUser = require('../models/projectUser')
const Users = require('../models/users')
const { Op, where } = require('sequelize');
const createDailyService = async (createDaily, user_id) => {
    try {
        console.log('user_id', user_id)
        const {
            ProjectId,
            Content,
            Hours,
            Date: inputDate // Đổi tên biến để tránh xung đột
        } = createDaily;

        const projectIdInt = parseInt(ProjectId, 10)
        // Kiểm tra nếu inputDate hợp lệ
        const parsedDate = Date.parse(inputDate);
        if (isNaN(parsedDate)) throw new Error("Invalid Date format");

        const formattedDate = new Date(parsedDate).toISOString().split('T')[0];
        const user = await ProjectUser.findOne({
            where: {
                UserId: user_id, ProjectId: projectIdInt
            }
        });
        console.log(user)
        if (!user) {
            throw new Error('Bạn tổn luồi tham gia dự án')
        }
        const UserId1 = user.UserId
        const newDaily = await Daily.create({
            UserId: UserId1,
            ProjectId: projectIdInt,
            Content,
            Hours,
            Date: formattedDate,
            CreatedAt: new Date(), // Ngày hiện tại
            Status: true
        });

        return { status: "Success", message: "Tạo thành công", data: newDaily };
    } catch (e) {
        console.log(e);
        return { status: "Err", message: e.message };
    }
};
const getDailyByDateRangeService = async (projectId, day, month, year) => {
    try {
        let whereClause = {
            ProjectId: projectId
        };

        // Tạo các điều kiện lọc theo ngày, tháng, và năm
        if (year) {
            whereClause.Date = {
                [Op.gte]: `${year}-01-01`,
                [Op.lte]: `${year}-12-31`
            };
        }
        if (month) {
            const startMonth = `${year}-${String(month).padStart(2, '0')}-01`;
            const endMonth = new Date(year, month, 0).toISOString().split('T')[0];
            whereClause.Date = {
                [Op.gte]: startMonth,
                [Op.lte]: endMonth
            };
        }
        if (day) {
            const formattedDay = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            whereClause.Date = formattedDay;  // Tìm theo đúng ngày
        }

        const dailyRecords = await Daily.findAll({
            where: whereClause
        });

        return dailyRecords;
    } catch (error) {
        throw new Error('Unable to retrieve Daily records');
    }
};
const getDailyByUserService = async (projectId, user_id) => {
    try {
        const dailyUser = await Daily.findAll({
            where: { UserId: user_id, ProjectId: projectId }
        })
        if (!dailyUser) {
            throw new Error('Lỗi1');
        }
        return dailyUser;
    } catch (error) {
        console.log(error)
        throw new Error('Lỗi2');
    }
}
module.exports = {
    createDailyService,
    getDailyByDateRangeService,
    getDailyByUserService
};
