const attendanceService = require('../services/attendanceService'); // Import hàm tạo attendance từ service
const CheckIn = require('../models/checkIn');
const CheckOut = require('../models/checkOut'); // Giả sử bạn có model CheckOut tương tự như CheckIn
const Daily = require('../models/daily');
const Request = require('../models/request')
const Attendance = require('../models/attendance');

const createAttendanceController = async (req, res) => {
    try {
        const user_id = req.user_id
        const { Date } = req.body;
        console.log(Date);
        const existingAttendance = await Attendance.findOne({
            where: { UserId: user_id, Date: Date }
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance đã tồn tại cho ngày này.' });
        }
        const checkInRecord = await CheckIn.findOne({
            where: { UserId: user_id, Date: Date }
        });

        const checkOutRecord = await CheckOut.findOne({
            where: { UserId: user_id, Date: Date }
        });

        const requestRecord = await Request.findOne({
            where: { UserId: user_id, Date: Date }
        });

        const dailyRecord = await Daily.findOne({
            where: { UserId: user_id, Date: Date }
        });

        if (!dailyRecord) {
            return res.status(404).json({ message: 'Daily trước khi log ngày công.' });
        }

        const attendanceData = {
            UserId: user_id,
            CheckIn: checkInRecord ? checkInRecord.CheckIn : null,
            CheckOut: checkOutRecord ? checkOutRecord.CheckOut : null,
            RequestId: requestRecord ? requestRecord.Id : null,   
            ProjectId: dailyRecord.ProjectId,
            Date: Date
        };

        const newAttendance = await attendanceService.createAttendance(attendanceData, user_id);
        return res.status(201).json({ message: 'Attendance đã được tạo thành công.', attendance: newAttendance });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo attendance.' });
    }
};

const getAttendanceController = async (req, res) => {
    try {
        const { year, month } = req.body; // Lấy year và month từ body request

        // Kiểm tra nếu year và month có hợp lệ
        if (!year || !month) {
            return res.status(400).json({ message: 'Cần cung cấp year và month.' });
        }

        // Gọi service để lấy dữ liệu attendance
        const attendances = await attendanceService.getAttendancesByMonth(year, month);

        if (attendances.length === 0) {
            return res.status(404).json({ message: 'Không có attendance nào cho tháng này.' });
        }

        // Trả về dữ liệu attendance
        return res.status(200).json({ attendances });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy attendance.' });
    }
};



module.exports = { createAttendanceController, getAttendanceController };
