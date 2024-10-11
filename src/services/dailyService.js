const Daily = require('../models/daily');
const Projects = require('../models/projects')
const { Op } = require('sequelize');
const createDailyService = async (createDaily) => {
    try {
        const {
            UserId,
            ProjectId,
            Content,
            Hours,
            Date: inputDate // Đổi tên biến để tránh xung đột
        } = createDaily;

        // Kiểm tra nếu inputDate hợp lệ
        const parsedDate = Date.parse(inputDate);
        if (isNaN(parsedDate)) throw new Error("Invalid Date format");

        const formattedDate = new Date(parsedDate).toISOString().split('T')[0];

        const newDaily = await Daily.create({
            UserId,
            ProjectId,
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
module.exports = {
    createDailyService,
    getDailyByDateRangeService
};
