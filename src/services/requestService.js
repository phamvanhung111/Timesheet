const { where } = require('sequelize');
const ProjectUser = require('../models/projectUser');
const Request = require('../models/request');
const RequestType = require('../models/requestType')
const { generateCreateAtFilter } = require('../config/filterDate');
const { parse } = require('dotenv');
const Attendance = require('../models/attendance');
const createRequestService = async (data, user_id) => {
    try {
        console.log(user_id);
        const {
            ProjectId,
            TypeId,
            Reason,
            Hours,
            Date: requestDate
        } = data;
        if ((TypeId === 1 || TypeId === 2) && Hours > 2.00) {
            return { status: 400, message: 'Tối đa 2 tiếng' };
        }
        const userProject = await ProjectUser.findOne({
            where: { UserId: user_id, ProjectId: ProjectId }
        });

        if (!userProject) {
            throw new Error('Bạn không ở trong project này');
        }

        const newProject = await Request.create({
            UserId: user_id,
            ProjectId,
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

const updateRequestHoursAndTypeService = async (user_id, requestId, newHours, newType) => {
    try {
        if ((newType === 1 || newType === 2) && newHours > 2.00) {
            return { status: 400, message: 'Giờ chỉ có thể tối đa là 2.00 cho loại yêu cầu 1 hoặc 2' };
        }

        const request = await Request.findOne({ where: { Id: requestId, UserId: user_id } });
        console.log('Alo', request)
        if (!request) {
            return { status: 404, message: 'Không tìm thấy yêu cầu' };
        }

        // Update the hours and type in the request
        const [rowsUpdated, updatedRequest] = await Request.update(
            { Hours: newHours, Type: newType },
            {
                where: { Id: requestId },
                returning: true,
            }
        );

        if (rowsUpdated === 0) {
            return { status: 400, message: 'Không thể cập nhật giờ và loại yêu cầu' };
        }

        // Find the associated attendance record
        const attendanceRecord = await Attendance.findOne({ where: { RequestId: requestId } });
        if (attendanceRecord) {
            const { CheckIn, CheckOut } = attendanceRecord;

            // Recalculate attendance fields based on the new Hours and Type
            const lateMinutes = CheckIn > '08:30:00'
                ? (timeToMinutes(CheckIn) - timeToMinutes('08:30:00')) - (newType === 1 || newType === 3 ? newHours * 60 : 0)
                : (timeToMinutes(CheckIn) - timeToMinutes('08:30:00'));

            const earlyLeaveMinutes = CheckOut < '17:30:00'
                ? (timeToMinutes(CheckOut) - timeToMinutes('17:30:00')) + (newType === 2 || newType === 4 ? newHours * 60 : 0)
                : (timeToMinutes('17:30:00') - timeToMinutes(CheckOut));

            const workingHours = (timeToMinutes(CheckOut) - timeToMinutes(CheckIn)) / 60 - 1;

            // Calculate the fee based on the attendance record
            let feeMoney = 0;
            if (!CheckIn && !CheckOut) {
                feeMoney = 100000;
            } else if (!CheckIn || !CheckOut) {
                feeMoney = 3000;
            } else if (lateMinutes > 0 || earlyLeaveMinutes > 0) {
                feeMoney = 50000;
            }

            // Update the attendance record with recalculated values
            await Attendance.update({
                LateMinutes: lateMinutes,
                EarlyLeaveMinutes: earlyLeaveMinutes,
                WorkingHours: workingHours,
                FeeMoney: feeMoney
            }, {
                where: { RequestId: requestId }
            });
        }


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




const getAllRequestByProjectService = async (ProjectId, day, month, year) => {
    try {
        let whereClause = {
            ProjectId: ProjectId,
            CreatedAt: generateCreateAtFilter(day, month, year)
        };
        const getAllRequestProject = await Request.findAll(
            { where: whereClause }
        )
        return getAllRequestProject
    } catch (error) {
        return {
            status: 'Err',
            message: error.message
        }
    }
}

const getAllRequestByUserService = async (userid, role, UserId, day, month, year) => {
    try {
        const intUserId = parseInt(UserId, 10)
        if (role !== 1 && intUserId !== userid) {
            return {
                status: 'Err',
                message: 'You do not have permission to view requests of other users.'
            };
        }
        const getAllRequestUser = await Request.findAll(
            {
                where: {
                    UserId: intUserId,
                    CreatedAt: generateCreateAtFilter(day, month, year)
                }
            }
        )
        return getAllRequestUser
    } catch (error) {
        console.log(error)
        return {
            status: 'Err',
            message: error.message
        }
    }
}

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
    updateRequestHoursAndTypeService
}
