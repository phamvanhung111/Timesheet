const attendanceService = require('../services/attendanceService'); // Import hàm tạo attendance từ service

const createAttendanceController = async (req, res) => {
    try {
        const user_id = req.user_id;
        const attendanceData = req.body;

        const newAttendance = await attendanceService.createAttendance(attendanceData, user_id);

        if (newAttendance.status === 400) {
            return res.status(400).json({ message: newAttendance.message });
        }

        return res.status(201).json({ message: 'Attendance đã được tạo thành công.', attendance: newAttendance });
    } catch (error) {
        console.error('Error in createAttendanceController:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo attendance.' });
    }
};

const getAttendanceController = async (req, res) => {
    try {
        const { year, month } = req.body; // Lấy year và month từ body request
        const userid = req.user_id
        // Kiểm tra nếu year và month có hợp lệ
        if (!year || !month) {
            return res.status(400).json({ message: 'Cần cung cấp year và month.' });
        }
        // Gọi service để lấy dữ liệu attendance
        const attendances = await attendanceService.getAttendancesByMonth(userid, year, month);
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
