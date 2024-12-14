const { generateDateFilter } = require('../config/filterDate');
const CheckOut = require('../models/CheckOut');
const createCheckOutService = async (user_id) => {
    try {
        const currentDate = new Date();
        const currentTime = currentDate.toTimeString().split(' ')[0]; // Lấy phần giờ:phút:giây

        const createCheckOut = await CheckOut.create({
            UserId: user_id,
            CheckOut: currentTime, // Lưu thời gian hiện tại vào trường CheckIn
            Date: currentDate
        });

        return currentTime
    } catch (error) {
        console.log(error);
        return { status: "Err", message: error.message };
    }
}


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

