const { where } = require('sequelize');
const ProjectUser = require('../models/projectUser');
const Request = require('../models/request');
const RequestType = require('../models/requestType')
const { generateCreateAtFilter } = require('../config/filterDate');
const { parse } = require('dotenv');
const Attendance = require('../models/attendance');
const { Op } = require('sequelize');

const moment = require('moment')
const createRequestService = async (data, user_id) => {
    try {
        console.log(user_id);
        const {
            TypeId,
            Reason,
            Hours,
            Date: requestDate
        } = data;
        if ((TypeId === 1 || TypeId === 2) && Hours > 2.00) {
            return { status: 400, message: 'Tối đa 2 tiếng' };
        }
        const userProject = await ProjectUser.findOne({
            where: {
                UserId: user_id
            }
        })
        if (!userProject) {
            throw new Error('Bạn không thuộc bất kỳ project nào');
        }

        const { ProjectId } = userProject;

        const existingRequest = await Request.findOne({
            where: {
                UserId: user_id,
                ProjectId,
                Date: requestDate || new Date()
            }
        });

        if (existingRequest) {
            return { status: 400, message: 'Request đã tồn tại trong ngày này' };
        }

        const newProject = await Request.create({
            UserId: user_id,
            ProjectId: ProjectId,
            Type: TypeId,
            Reason,
            CreatedAt: new Date(),
            StartAt: null,
            EndAt: null,
            Hours,
            Date: requestDate || new Date() // Use requestDate here
        });

        if (newProject) {
            return {
                status: "Success",
                message: "Tạo thành công",
                data: newProject
            };
        }
    } catch (e) {
        console.log(e);
        return { status: "Err", message: e.message };
    }
};

const updateRequestService = async (user_id, requestId, newHours, newType) => {
    try {
        if ((newType === 1 || newType === 2) && newHours > 2.00) {
            return { status: 400, message: 'Giờ chỉ có thể tối đa là 2.00 cho loại yêu cầu 1 hoặc 2' };
        }

        const request = await Request.findOne({ where: { Id: requestId, UserId: user_id } });
        console.log('Alo', request)
        if (!request) {
            return { status: 404, message: 'Không tìm thấy yêu cầu' };
        }
        if (request.Status === 'Approved') {
            return { status: 404, message: 'Dã duyệt, không thể chỉnh sửa' };
        }
        // Update the hours and type in the request
        const updatedRequest = await Request.update(
            { Hours: newHours, Type: newType },
            {
                where: { Id: requestId },
            }
        );

        return { status: 200, message: 'Giờ và loại yêu cầu đã được cập nhật thành công', updatedRequest };
    } catch (error) {
        console.error(error);
        return { status: 500, message: 'Đã xảy ra lỗi', error };
    }
};




const getAllRequestTypeService = async () => {
    try {
        const getAllRequestType = await RequestType.findAll()
        return getAllRequestType
    } catch (error) {
        return {
            status: 'Err',
            message: error.message
        }
    }
}
const approvelRequestService = async (requestId, Status) => {
    try {
        const oldRequest = await Request.findOne({
            where: { Id: requestId }
        });
        if (!oldRequest) {
            return { status: 404, message: 'Không tìm thấy yêu cầu' };
        }

        const [rowsUpdated, updatedRequest] = await Request.update(
            { Status: Status },
            {
                where: { Id: requestId },
                returning: true,
            }
        );

        if (rowsUpdated === 0) {
            return { status: 400, message: 'Trạng thái yêu cầu không được cập nhật' };
        }

        const attendanceRecord = await Attendance.findOne({
            where: { RequestId: requestId }
        });
        if (!attendanceRecord) {
            return { status: 404, message: 'Không tìm thấy bản ghi điểm danh' };
        }

        if (Status === 'Approved' && oldRequest.Status === 'Pending') {
            const { CheckIn, CheckOut } = attendanceRecord;
            const { Type, Hours } = oldRequest;

            const lateMinutes = CheckIn > '08:30:00'
                ? (timeToMinutes(CheckIn) - timeToMinutes('08:30:00')) - (Type === 1 || Type === 3 ? Hours * 60 : 0)
                : 0;

            const earlyLeaveMinutes = CheckOut < '17:30:00'
                ? (timeToMinutes(CheckOut) - timeToMinutes('17:30:00')) + (Type === 2 || Type === 4 ? Hours * 60 : 0)
                : 0;

            const workingHours = (timeToMinutes(CheckOut) - timeToMinutes(CheckIn)) / 60 - 1;

            let feeMoney = 0;
            if (!CheckIn && !CheckOut) {
                feeMoney = 100000;
            } else if (!CheckIn || !CheckOut) {
                feeMoney = 3000;
            } else if (lateMinutes > 0 || earlyLeaveMinutes > 0) {
                feeMoney = 50000;
            }

            await Attendance.update({
                LateMinutes: lateMinutes,
                EarlyLeaveMinutes: earlyLeaveMinutes,
                WorkingHours: workingHours,
                FeeMoney: feeMoney
            }, {
                where: { RequestId: requestId }
            });
        }

        return { status: 200, message: 'Yêu cầu đã được cập nhật thành công', updatedRequest };
    } catch (error) {
        console.error(error);
        return { status: 500, message: 'Đã xảy ra lỗi', error };
    }
};




const getAllRequestByProjectService = async (ProjectId, startDate, endDate) => {
    try {

        const whereCondition = {
            ProjectId: ProjectId,
        };


        if (startDate && endDate) {
            whereCondition.Date = {
                [Op.between]: [startDate, endDate],
            };
        }

        const getAllRequestProject = await Request.findAll({
            where: whereCondition,
        });

        return getAllRequestProject;
    } catch (error) {
        return {
            status: 'Err',
            message: error.message,
        };
    }
};


const getAllRequestByUserService = async (userid, role, UserId, startDate, endDate) => {
    try {
        const intUserId = parseInt(UserId, 10);

        // Kiểm tra quyền truy cập của user
        if (role !== 1 && intUserId !== userid) {
            return {
                status: 'Err',
                message: 'You do not have permission to view requests of other users.'
            };
        }

        // Tạo điều kiện tìm kiếm cơ bản
        const whereCondition = {
            UserId: intUserId,
        };

        // Nếu có startDate và endDate, thêm điều kiện lọc theo ngày
        if (startDate && endDate) {
            const formattedStartDate = moment(startDate, "YY-DD-MM").format("YYYY-MM-DD HH:mm:ss");
            const formattedEndDate = moment(endDate, "YY-DD-MM").format("YYYY-MM-DD HH:mm:ss");

            whereCondition.CreatedAt = {
                [Op.between]: [formattedStartDate, formattedEndDate],
            };
        }

        // Tìm tất cả các yêu cầu của user trong khoảng thời gian (nếu có) hoặc tất cả bản ghi nếu không có thời gian
        const getAllRequestUser = await Request.findAll({
            where: whereCondition,
        });

        return getAllRequestUser;
    } catch (error) {
        console.log(error);
        return {
            status: 'Err',
            message: error.message
        };
    }
};


function timeToMinutes(time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 60 + minutes + seconds / 60;
}


module.exports = {
    createRequestService,
    getAllRequestTypeService,
    approvelRequestService,
    getAllRequestByProjectService,
    getAllRequestByUserService,
    updateRequestService
}
