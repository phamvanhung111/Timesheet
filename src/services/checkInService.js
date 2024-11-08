const checkIn = require('../models/checkIn');
const { generateDateFilter } = require('../config/filterDate');
const { get } = require('mongoose');
const createCheckInService = async (data, user_id) => {
    try {
        const { CheckIn } = data;

        // Lấy thời gian hiện tại
        const currentDate = new Date();
        const currentTime = currentDate.toTimeString().split(' ')[0]; // Lấy phần giờ:phút:giây

        const createCheckIn = await checkIn.create({
            UserId: user_id,
            CheckOut: CheckIn,
            CheckIn: currentTime, // Lưu thời gian hiện tại vào trường CheckIn
            Date: currentDate
        });

        return createCheckIn;
    } catch (error) {
        console.log(error);
        return { status: "Err", message: error.message };
    }
}

const getCheckInUserService = async (user_id, day, month, year) => {
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

        // Tìm kiếm bản ghi với điều kiện đã xác định
        const getCheckInUser = await checkIn.findAll({
            where: whereCondition
        });

        return getCheckInUser;
    } catch (error) {
        console.error("Error in getCheckInUserService:", error);
        return { status: "Err", message: error.message };
    }
};



module.exports = {
    createCheckInService,
    getCheckInUserService
}

