const attendanceService = require('../services/attendanceService'); // Import hàm tạo attendance từ service

const createAttendanceController = async (req, res) => {
    try {
        const user_id = req.user_id
        const { UserId, CheckIn, CheckOut, ProjectId, RequestId } = req.body;
        const attendanceData = {
            UserId,
            CheckIn: CheckIn,
            CheckOut: CheckOut,
            ProjectId,
            RequestId
        };

        const newAttendance = await attendanceService.createAttendance(attendanceData, user_id);
        return res.status(201).json({ message: 'Attendance đã được tạo thành công.', attendance: newAttendance });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo attendance.' });
    }
};


module.exports = { createAttendanceController };
