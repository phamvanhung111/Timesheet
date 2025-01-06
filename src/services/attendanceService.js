const CheckIn = require('../models/checkIn');
const CheckOut = require('../models/checkOut'); // Giả sử bạn có model CheckOut tương tự như CheckIn
const Attendance = require('../models/attendance');
const Request = require('../models/request')
const { Op } = require('sequelize');
const Daily = require('../models/daily')
const { where } = require('sequelize');
// const createAttendance = async (attendanceData, user_id) => {
//     try {
//         const { ProjectId, Date: dateFromBody } = attendanceData;

//         // Get current date or use provided date
//         const attendanceDate = dateFromBody;

//         // Check if the date is a Saturday or Sunday
//         const dateObj = new Date(attendanceDate);
//         const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday

//         // Default values for attendance
//         let lateMinutes = 0, earlyLeaveMinutes = 0, workingHours = 0, feeMoney = 0;

//         // If the date is not Saturday (6) or Sunday (0), proceed with regular calculations
//         if (dayOfWeek !== 0 && dayOfWeek !== 6) {
//             const existingAttendance = await Attendance.findOne({
//                 where: { UserId: user_id, Date: attendanceDate }
//             });

//             if (existingAttendance) {
//                 return { status: 400, message: 'Đã tồn tại Attendance trong ngày này' };
//             }

//             // Find CheckIn, CheckOut, and Request records for the specified date and user
//             const checkInRecord = await CheckIn.findOne({
//                 where: { UserId: user_id, Date: attendanceDate }
//             });

//             const checkOutRecord = await CheckOut.findOne({
//                 where: { UserId: user_id, Date: attendanceDate }
//             });

//             const checkRequest = await Request.findOne({
//                 where: { UserId: user_id, Date: attendanceDate }
//             });

//             // Assign values or default to null if records are not found
//             const checkInValue = checkInRecord ? checkInRecord.CheckIn : null;
//             const checkOutValue = checkOutRecord ? checkOutRecord.CheckOut : null;
//             const requestIdValue = checkRequest ? checkRequest.Id : null;
//             const reqHours = checkRequest && checkRequest.Status === 'Pending' ? 0 : (checkRequest ? checkRequest.Hours : 0);
//             const reqType = checkRequest ? checkRequest.Type : null;

//             // Set CheckIn or CheckOut to "00:00:00" based on reqType
//             // Calculate FeeMoney based on CheckIn and CheckOut presence
//             if (!checkInValue && !checkOutValue) {
//                 feeMoney = 100000;
//                 workingHours = 0
//             } else if (!checkInValue || !checkOutValue) {
//                 feeMoney = 30000;
//                 workingHours = 0
//             }

//             // Calculate LateMinutes, EarlyLeaveMinutes, and WorkingHours
//             if (checkInValue && checkOutValue) {
//                 const startOfDay = "08:30:00";
//                 const endOfDay = "17:30:00";

//                 // Convert times to minutes for calculation
//                 const timeToMinutes = (time) => {
//                     const [hours, minutes, seconds] = time.split(':').map(Number);
//                     return hours * 60 + minutes;
//                 };

//                 const checkInMinutes = timeToMinutes(checkInValue);
//                 const checkOutMinutes = timeToMinutes(checkOutValue);
//                 const startOfDayMinutes = timeToMinutes(startOfDay);
//                 const endOfDayMinutes = timeToMinutes(endOfDay);

//                 // LateMinutes calculation
//                 if (checkInMinutes > startOfDayMinutes) {
//                     let late = checkInMinutes - startOfDayMinutes;
//                     if ([1, 3].includes(reqType)) {
//                         late -= reqHours * 60;
//                     }
//                     lateMinutes = late;
//                 }

//                 // EarlyLeaveMinutes calculation
//                 if (checkOutMinutes < endOfDayMinutes) {
//                     let earlyLeave = endOfDayMinutes - checkOutMinutes;
//                     if ([2, 4].includes(reqType)) {
//                         earlyLeave -= reqHours * 60;
//                     }
//                     earlyLeaveMinutes = earlyLeave;
//                 }

//                 // WorkingHours calculation (in hours)
//                 if (reqType == 3 || reqType == 4) {
//                     workingHours = (checkOutMinutes - checkInMinutes) / 60
//                 } else {
//                     workingHours = (checkOutMinutes - checkInMinutes) / 60 - 1
//                 }
//             }

//             if ((lateMinutes > 0 || earlyLeaveMinutes > 0)) {
//                 feeMoney += 50000;
//             }
//             if (lateMinutes > 0 && earlyLeaveMinutes > 0) {
//                 feeMoney += 100000;
//             }

//             // Create the Attendance record
//             const newAttendance = await Attendance.create({
//                 UserId: user_id,
//                 Date: attendanceDate,
//                 CheckIn: checkInValue,
//                 CheckOut: checkOutValue,
//                 ProjectId,
//                 RequestId: requestIdValue,
//                 FeeMoney: feeMoney,
//                 LateMinutes: lateMinutes,
//                 EarlyLeaveMinutes: earlyLeaveMinutes,
//                 WorkingHours: workingHours,
//                 CreatedAt: new global.Date()
//             });

//             return newAttendance;
//         } else {
//             // For weekends (Saturday and Sunday), set all values to 0
//             const newAttendance = await Attendance.create({
//                 UserId: user_id,
//                 Date: attendanceDate,
//                 CheckIn: null,
//                 CheckOut: null,
//                 ProjectId,
//                 RequestId: null,
//                 FeeMoney: 0,
//                 LateMinutes: 0,
//                 EarlyLeaveMinutes: 0,
//                 WorkingHours: 0,
//                 CreatedAt: new global.Date()
//             });

//             return newAttendance;
//         }
//     } catch (error) {
//         console.error(error);
//         return { status: "Err", message: error.message };
//     }
// };




const createAttendance = async (attendanceData, user_id) => {
    try {
        const { ProjectId, Date: dateFromBody } = attendanceData;

        // Get current date or use provided date
        const attendanceDate = dateFromBody

        const existingAttendance = await Attendance.findOne({
            where: { UserId: user_id, Date: attendanceDate }
        });

        if (existingAttendance) {
            return { status: 400, message: 'Đã tồn tại Attendance trong ngày này' };
        }
        // Find CheckIn, CheckOut, and Request records for the specified date and user
        const checkInRecord = await CheckIn.findOne({
            where: { UserId: user_id, Date: attendanceDate }
        });

        const checkOutRecord = await CheckOut.findOne({
            where: { UserId: user_id, Date: attendanceDate }
        });

        const checkRequest = await Request.findOne({
            where: { UserId: user_id, Date: attendanceDate }
        });

        // const dailyRecord = await Daily.findOne({
        //     where: { UserId: user_id, Date: Date }
        // });
        // if (!dailyRecord) {
        //     return res.status(404).json({ message: 'Daily trước khi log ngày công.' });
        // }

        // Assign values or default to null if records are not found
        const checkInValue = checkInRecord ? checkInRecord.CheckIn : null;
        const checkOutValue = checkOutRecord ? checkOutRecord.CheckOut : null;
        const requestIdValue = checkRequest ? checkRequest.Id : null;
        const reqHours = parseInt(checkRequest && checkRequest.Status === 'Pending' ? 0 : (checkRequest ? checkRequest.Hours : 0), 10)
        const reqType = checkRequest ? checkRequest.Type : null;

        // Calculate FeeMoney based on CheckIn and CheckOut presence
        let feeMoney = 0; let lateMinutes = 0, earlyLeaveMinutes = 0, workingHours = 0;
        if (!checkInValue && !checkOutValue) {
            feeMoney = 100000;
        } else if (!checkInValue || !checkOutValue) {
            feeMoney = 30000;
            const startOfDay = "08:30:00";
            const endOfDay = "17:30:00";

            // Convert times to minutes for calculation
            const timeToMinutes = (time) => {
                const [hours, minutes, seconds] = time.split(':').map(Number);
                return hours * 60 + minutes;
            }

            if (checkInValue) {
                const checkInMinutes = timeToMinutes(checkInValue);
                const startOfDayMinutes = timeToMinutes(startOfDay);
                if (checkInMinutes > startOfDayMinutes) {
                    let late = checkInMinutes - startOfDayMinutes;
                    if ([1, 3].includes(reqType)) {
                        late -= reqHours * 60;
                    }
                    lateMinutes = late;
                }
            }
            if (checkOutValue) {
                const checkOutMinutes = timeToMinutes(checkOutValue);
                const endOfDayMinutes = timeToMinutes(endOfDay);
                // EarlyLeaveMinutes calculation
                if (checkOutMinutes < endOfDayMinutes) {
                    let earlyLeave = endOfDayMinutes - checkOutMinutes;
                    if ([2, 4].includes(reqType)) {
                        earlyLeave -= reqHours * 60;
                    }
                    earlyLeaveMinutes = earlyLeave;
                }
            }
        }

        // Calculate LateMinutes, EarlyLeaveMinutes, and WorkingHours


        if (checkInValue && checkOutValue) {
            const startOfDay = "08:30:00";
            const endOfDay = "17:30:00";

            // Convert times to minutes for calculation
            const timeToMinutes = (time) => {
                const [hours, minutes, seconds] = time.split(':').map(Number);
                return hours * 60 + minutes;
            };

            const checkInMinutes = timeToMinutes(checkInValue);
            const checkOutMinutes = timeToMinutes(checkOutValue);
            const startOfDayMinutes = timeToMinutes(startOfDay);
            const endOfDayMinutes = timeToMinutes(endOfDay);

            if (checkInMinutes > startOfDayMinutes) {
                let late = checkInMinutes - startOfDayMinutes;
                if ([1].includes(reqType)) {
                    late -= reqHours * 60;
                }
                if ([3].includes(reqType)) {
                    late -= (reqHours + 0.5) * 60;
                }
                lateMinutes = late;
            }

            // EarlyLeaveMinutes calculation
            if (checkOutMinutes < endOfDayMinutes) {
                let earlyLeave = endOfDayMinutes - checkOutMinutes;
                if ([2].includes(reqType)) {
                    earlyLeave -= reqHours * 60;
                }
                if ([4].includes(reqType)) {
                    earlyLeave -= (reqHours + 1.5) * 60;
                }
                earlyLeaveMinutes = earlyLeave;
            }

            // WorkingHours calculation (in hours)
            if (reqType == 3 || reqType == 4) {
                workingHours = (checkOutMinutes - checkInMinutes) / 60;
            } else {
                workingHours = (checkOutMinutes - checkInMinutes) / 60 - 1;
            }
        }

        if ((lateMinutes > 0 && earlyLeaveMinutes > 0)) {
            feeMoney += 100000;
        } else {
            if ((lateMinutes > 0 || earlyLeaveMinutes > 0)) {
                feeMoney += 50000;
            }
        }

        // Create the Attendance record
        const newAttendance = await Attendance.create({
            UserId: user_id,
            Date: attendanceDate,
            CheckIn: checkInValue,
            CheckOut: checkOutValue,
            ProjectId,
            RequestId: requestIdValue,
            FeeMoney: feeMoney,
            LateMinutes: lateMinutes,
            EarlyLeaveMinutes: earlyLeaveMinutes,
            WorkingHours: workingHours,
            CreatedAt: new global.Date()
        });

        return newAttendance;
    } catch (error) {
        console.error(error);
        return { status: "Err", message: error.message };
    }
};
const getAttendancesByMonth = async (userid, year, month) => {
    try {
        // Tạo ngày bắt đầu và kết thúc của tháng
        const startDate = new Date(year, month - 1, 1); // Tháng bắt đầu từ 0 trong JavaScript
        const endDate = new Date(year, month, 0); // Ngày cuối cùng của tháng

        // Tìm tất cả attendance trong tháng này
        const attendances = await Attendance.findAll({
            where: {
                UserId: userid,
                Date: {
                    [Op.gte]: startDate, // Tìm từ ngày bắt đầu
                    [Op.lte]: endDate // Đến ngày cuối cùng
                }
            }
        });

        return attendances; // Trả về tất cả attendance trong tháng
    } catch (error) {
        console.error('Error fetching attendances:', error);
        throw error; // Ném lỗi để controller có thể xử lý
    }
};



module.exports = {
    createAttendance,
    getAttendancesByMonth
};


