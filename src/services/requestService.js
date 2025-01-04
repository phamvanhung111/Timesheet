const { where } = require('sequelize');
const ProjectUser = require('../models/projectUser');
const Request = require('../models/request');
const RequestType = require('../models/requestType')
const { generateCreateAtFilter } = require('../config/filterDate');
const { parse } = require('dotenv');
const Projects = require('../models/projects')
const Attendance = require('../models/attendance');
const { Op, Sequelize  } = require('sequelize');
const Users = require('../models/users');

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
            return { message: 'Không tìm thấy yêu cầu' };
        }

        const [rowsUpdated, updatedRequest] = await Request.update(
            { Status: Status },
            {
                where: { Id: requestId },
                returning: true,
            }
        );

        if (rowsUpdated === 0) {
            return { message: 'Trạng thái yêu cầu không được cập nhật' };
        }

        return { message: 'Yêu cầu đã được cập nhật thành công' };
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

const getAllRequestByPMService = async (user_id, status) => {
    try {
        const projects = await Projects.findAll({
            where: {
                PM: user_id
            }
        });

        if (!projects || projects.length === 0) {
            return [];
        }

        const getAllRequestType = await RequestType.findAll({
            attributes: ['Id', 'TypeName']
        });

        const users = await Users.findAll({
            attributes: ['Id', 'FullName']
        });

        const projectIds = projects.map(project => project.Id);

        // Điều kiện lọc dựa trên status
        const whereClause = {
            ProjectId: {
                [Sequelize.Op.in]: projectIds, 
            },
        };

        if (status) {
            whereClause.Status = status; // Thêm điều kiện status nếu tồn tại
        }
        console.log(whereClause);

        const getAllRequestProject = await Request.findAll({
            where: whereClause,
        });
        const userMap = new Map(users.map(user => [user.Id, user.FullName]));
        const requestTypeMap = new Map(getAllRequestType.map(type => [type.Id, type.TypeName]));

        const result = getAllRequestProject.map(request => ({
            FullName: userMap.get(request.UserId) || 'Unknown', // Lấy FullName từ userMap
            TypeName: requestTypeMap.get(request.Type) || 'Unknown', // Lấy TypeName từ requestTypeMap
            Reason: request.Reason,
            CreatedAt: request.CreatedAt,
            Hours: request.Hours,
            Date: request.Date,
            Status: request.Status,
            Id: request.Id
          }));
          
        return result;
    } catch (error) {
        return {
            status: 'Err',
            message: error.message,
        };
    }
};



const getAllRequestByUserService = async (user_id, month, year) => {
    try {
        const intUserId = parseInt(user_id, 10);

        // Tạo điều kiện tìm kiếm cơ bản
        const whereCondition = {
            UserId: intUserId,
        };

        // Xác định ngày bắt đầu và ngày kết thúc của tháng
        if (month && year) {
            const startDate = moment(`${year}-${month}-01`, "YYYY-MM-DD").startOf('month').format("YYYY-MM-DD HH:mm:ss");
            const endDate = moment(`${year}-${month}-01`, "YYYY-MM-DD").endOf('month').format("YYYY-MM-DD HH:mm:ss");

            whereCondition.CreatedAt = {
                [Op.between]: [startDate, endDate],
            };
        }

        // Tìm tất cả các yêu cầu của user trong khoảng thời gian
        const getAllRequestUser = await Request.findAll({
            where: whereCondition,
        });

        return getAllRequestUser;
    } catch (error) {
        console.error(error);
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
    updateRequestService,
    getAllRequestByPMService
}
