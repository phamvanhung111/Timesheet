const Daily = require('../models/daily');
const Projects = require('../models/projects')
const ProjectUser = require('../models/projectUser')
const Users = require('../models/users')
const { Op, Sequelize  } = require('sequelize');
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

        const parsedDate = Date.parse(inputDate);
        if (isNaN(parsedDate)) throw new Error("Invalid Date format");

        const formattedDate = new Date(parsedDate).toISOString().split('T')[0];
        const user = await ProjectUser.findOne({
            where: {
                UserId: user_id, ProjectId: projectIdInt
            }
        });

        if (!user) {
            throw new Error('Bạn chưa tham gia dự án')
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
const getDailyByTimeRangeService = async (month, year, user_id) => {
    try {
        user_id = parseInt(user_id, 10);
        
        // Lấy tất cả các dự án mà user làm PM
        const projects = await Projects.findAll({
            where: { PM: user_id },
            attributes: ['Id', 'ProjectName']
        });

        if (!Array.isArray(projects) || projects.length === 0) {
            throw new Error('Không tìm thấy dự án nào do bạn làm PM.');
        }

        const projectIds = projects.map(project => project.Id);

        // Tạo điều kiện lọc ngày
        let dateFilter = {};
        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            dateFilter = { [Op.between]: [startDate, endDate] };
        }

        // Truy vấn tất cả các Daily theo điều kiện lọc
        const dailies = await Daily.findAll({
            where: {
                ProjectId: projectIds,
                ...(month && year ? { Date: dateFilter } : {}) // Nếu có month và year thì lọc
            }
        });

        if (!Array.isArray(dailies) || dailies.length === 0) {
            return [];
        }

        // Lấy thông tin user từ UserId trong Daily
        const userIds = [...new Set(dailies.map(daily => daily.UserId))];
        const users = await Users.findAll({
            where: { Id: userIds },
            attributes: ['Id', 'FullName']
        });

        // Map dữ liệu
        const dailyRecords = dailies.map(daily => {
            const user = users.find(user => user.Id === daily.UserId);
            const project = projects.find(project => project.Id === daily.ProjectId);
            return {
                ...daily.get(),
                UserName: user ? user.FullName : 'Unknown User',
                ProjectName: project ? project.ProjectName : 'Unknown Project'
            };
        });

        return dailyRecords;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Đã xảy ra lỗi khi xử lý dữ liệu.');
    }
};
const getDailyByUserService = async (user_id, startDate, endDate) => {
    try {
        const dailyUser = await Daily.findAll({
            where: {
                UserId: user_id,
                Date: {
                    [Sequelize.Op.between]: [startDate, endDate] // Sử dụng Op.between để kiểm tra phạm vi
                }
            }
        });
        if (!dailyUser) {
            throw new Error('Lỗi1');
        }
        return dailyUser;
    } catch (error) {
        console.log(error)
        throw new Error('Lỗi2');
    }
}
const updateDailyService = async (updateDaily, Id) => {
    try {
        const {
            Content,
            Hours,
            Date: inputDate
        } = updateDaily;
        const parsedDate = Date.parse(inputDate);
        if (isNaN(parsedDate)) throw new Error("Invalid Date format");

        const formattedDate = new Date(parsedDate).toISOString().split('T')[0];
        const daily = await Daily.findOne({ where: { Id: Id } });
        if (!daily) {
            throw new Error("Không tìm thấy id")
        }
        const newDaily = await Daily.update({
            Content,
            Hours: Hours,
            Date: formattedDate,
            CreatedAt: new Date(),
            Status: true
        }, {
            where: { Id: Id }
        });

        return { status: "Success", message: "Update thành công", data: newDaily };
    } catch (e) {
        console.log(e);
        return { status: "Err", message: e.message };
    }
};
module.exports = {
    createDailyService,
    getDailyByTimeRangeService,
    getDailyByUserService,
    updateDailyService
};
