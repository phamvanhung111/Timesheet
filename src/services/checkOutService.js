const checkOut = require('../models/checkOut');
const { generateDateFilter } = require('../config/filterDate');
const CheckOut = require('../models/checkOut');
const createCheckOutService = async (data, user_id) => {
    try {
        const { CheckOut } = data;

        // Lấy thời gian hiện tại
        const currentDate = new Date();
        const currentTime = currentDate.toTimeString().split(' ')[0];

        const createCheckOut = await checkOut.create({
            UserId: user_id,
            CheckOut: CheckOut,
            CheckOut: currentTime,
            Date: currentDate
        });

        return createCheckOut;
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

        // Tìm kiếm bản ghi với điều kiện đã xác định
        const getCheckOutUser = await CheckOut.findAll({
            where: whereCondition
        });

        return getCheckOutUser;
    } catch (error) {
        console.error("Error in getCheckOutUserService:", error);
        return { status: "Err", message: error.message };
    }
};


module.exports = {
    createCheckOutService,
    getCheckOutUserService
}

