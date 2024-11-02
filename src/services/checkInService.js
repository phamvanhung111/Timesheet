const checkIn = require('../models/checkIn');

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

module.exports = {
    createCheckInService
}

