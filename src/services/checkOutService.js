const checkOut = require('../models/checkOut');

const createCheckOutService = async (data, user_id) => {
    try {
        const { CheckOut } = data;

        // Lấy thời gian hiện tại
        const currentDate = new Date();
        const currentTime = currentDate.toTimeString().split(' ')[0]; // Lấy phần giờ:phút:giây

        const createCheckOut = await checkOut.create({
            UserId: user_id,
            CheckOut: CheckOut,
            CheckOut: currentTime, // Lưu thời gian hiện tại vào trường CheckOut
            Date: currentDate
        });

        return createCheckOut;
    } catch (error) {
        console.log(error);
        return { status: "Err", message: error.message };
    }
}

module.exports = {
    createCheckOutService
}

