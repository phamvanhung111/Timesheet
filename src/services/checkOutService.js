const { generateDateFilter } = require('../config/filterDate');
const CheckOut = require('../models/checkOut');
const { Op } = require('sequelize');
const createCheckOutService = async (user_id) => {
    try {
        // Lấy ngày hiện tại (không bao gồm giờ, phút, giây)
        const currentDate = new Date();
        const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)); // Đầu ngày
        const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999)); // Cuối ngày

        // Kiểm tra xem đã tồn tại bản ghi CheckOut trong ngày chưa
        const existingCheckOut = await CheckOut.findOne({
            where: {
                UserId: user_id,
                Date: {
                    [Op.between]: [startOfDay, endOfDay], // Kiểm tra trong khoảng ngày
                },
            },
        });

        if (existingCheckOut) {
            return { status: "Err", message: "CheckOut đã được tạo trong ngày hôm nay." };
        }

        // Lấy thời gian hiện tại
        const currentTime = new Date().toTimeString().split(' ')[0];

        // Tạo CheckOut mới
        const createCheckOut = await CheckOut.create({
            UserId: user_id,
            CheckOut: currentTime, // Lưu thời gian hiện tại vào trường CheckOut
            Date: new Date(),
        });

        return { status: "Success", data: createCheckOut };
    } catch (error) {
        console.log(error);
        return { status: "Err", message: error.message };
    }
};



const getCheckOutUserService = async (user_id, day, month, year) => {
    try {
        console.log(user_id);

        // Kiểm tra nếu không có day, month, year
        const whereCondition = {
            UserId: user_id
        };

        // Nếu day, month, year có giá trị thì thêm điều kiện Date vào
        if (day && month && year) {
            whereCondition.Date = generateDateFilter(day, month, year);
        }
        console.log(day, month, year)

        // Tìm kiếm bản ghi với điều kiện đã xác định
        const getCheckOutUser = await CheckOut.findAll({
            where: whereCondition
        });

        return {
            status: "Success",
            data: getCheckOutUser,
        };
    } catch (error) {
        console.error("Error in getCheckInUserService:", error);
        return { status: "Err", message: error.message };
    }
};


module.exports = {
    createCheckOutService,
    getCheckOutUserService
}

