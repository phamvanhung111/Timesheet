const Daily = require('../models/daily');
const Projects = require('../models/projects')
const ProjectUser = require('../models/projectUser')
const Users = require('../models/users')
const { Op } = require('sequelize');
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
const getDailyByTimeRangeService = async (startDate, endDate, user_id) => {
    try {
        const dailies = await Daily.findAll({
            where: {
                UserId: user_id,
                Date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });
        if (!dailies) {
            throw new Error('Lỗi1');
        }
        return dailies;
    } catch (error) {
        console.log(error);
        throw new Error('Lỗi2');
    }
};
const getDailyByUserService = async (user_id, Date) => {
    try {
        const dailyUser = await Daily.findAll({
            where: {
                UserId: user_id,
                Date: Date
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
