const CheckIn = require('../models/checkIn');
const CheckOut = require('../models/checkOut'); // Giả sử bạn có model CheckOut tương tự như CheckIn
const Attendance = require('../models/attendance');
const Request = require('../models/request')
const { where } = require('sequelize');

const createAttendance = async (attendanceData, user_id) => {
    try {
        const { ProjectId, Date: dateFromBody } = attendanceData;


        const attendanceDate = dateFromBody ? new global.Date(dateFromBody) : new global.Date();

        const checkInRecord = await CheckIn.findOne({
            where: { UserId: user_id, Date: attendanceDate }
        });

        const checkOutRecord = await CheckOut.findOne({
            where: { UserId: user_id, Date: attendanceDate }
        });

        const checkRequest = await Request.findOne({
            where: { UserId: user_id, Date: attendanceDate }
        });
        // Gán giá trị cho CheckIn, CheckOut và RequestId, mặc định là null nếu không tìm thấy
        const checkInValue = checkInRecord ? checkInRecord.CheckIn : null;
        const checkOutValue = checkOutRecord ? checkOutRecord.CheckOut : null;
        const requestIdValue = checkRequest ? checkRequest.Id : null;

        let feeMoney = 0;
        if (!checkInValue && !checkOutValue) {
            feeMoney = 100000;
        } else if (!checkInValue || !checkOutValue) {
            feeMoney = 30000;
        }


        const newAttendance = await Attendance.create({
            UserId: user_id,
            Date: attendanceDate,
            CheckIn: checkInValue,
            CheckOut: checkOutValue,
            ProjectId,
            RequestId: requestIdValue,
            FeeMoney: feeMoney,
            CreatedAt: new global.Date()
        });

        return newAttendance;
    } catch (error) {
        console.log(error);
        return { status: "Err", message: error.message };
    }
}


module.exports = {
    createAttendance
};


