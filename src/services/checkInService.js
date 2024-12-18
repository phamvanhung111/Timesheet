const CheckIn = require('../models/checkIn');
const { generateDateFilter } = require('../config/filterDate');
const { Op } = require('sequelize');
const moment = require('moment');

const createCheckInService = async (user_id) => {
    try {

        const currentDate = new Date();
        // Kiểm tra xem đã tồn tại bản ghi CheckOut trong ngày chưa
        const currentTime = currentDate.toTimeString().split(' ')[0]

        const createCheckIn = await CheckIn.create({
            UserId: user_id,
            CheckIn: currentTime, // Lưu thời gian hiện tại vào trường CheckIn
            Date: currentDate
        });

        return currentTime
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
        const getCheckInUser = await CheckIn.findAll({
            where: whereCondition
        });

        return {
            status: "Success",
            data: getCheckInUser,
        };
    } catch (error) {
        console.error("Error in getCheckInUserService:", error);
        return { status: "Err", message: error.message };
    }
};

const getWorkingTimeService = async (userId, startDate, endDate) => {
    try {
        // Generate all dates between startDate and endDate
        const datesInRange = [];
        let currentDate = moment(startDate); // Using moment to handle date
        const endMoment = moment(endDate);
        console.log(currentDate, endDate)

        // Loop through each date and push into datesInRange array
        while (currentDate.isSameOrBefore(endMoment)) {
            datesInRange.push(currentDate.format('YYYY-MM-DD'));
            currentDate = currentDate.add(1, 'day');
        }

        // Retrieve check-in and check-out records within the specified date range
        const checkInRecords = await CheckIn.findAll({
            where: {
                UserId: userId,
                Date: { [Op.between]: [startDate, endDate] }
            }
        });

        const checkOutRecords = await CheckOut.findAll({
            where: {
                UserId: userId,
                Date: { [Op.between]: [startDate, endDate] }
            }
        });

        // Map check-in and check-out records by date
        const checkInMap = checkInRecords.reduce((map, record) => {
            map[record.Date] = record.CheckIn;
            return map;
        }, {});

        const checkOutMap = checkOutRecords.reduce((map, record) => {
            map[record.Date] = record.CheckOut;
            return map;
        }, {});

        // Combine records, ensuring each date has entries for check-in and check-out
        const workingTimes = datesInRange.map(date => ({
            date,
            checkIn: checkInMap[date] || null,
            checkOut: checkOutMap[date] || null
        }));

        return {
            status: "Success",
            message: "Working times fetched successfully.",
            data: workingTimes
        };
    } catch (error) {
        console.error("Error fetching working times:", error);
        throw new Error("Failed to fetch working times.");
    }
};


module.exports = {
    createCheckInService,
    getCheckInUserService,
    getWorkingTimeService
}

