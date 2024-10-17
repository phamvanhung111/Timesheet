const { where } = require('sequelize');
const ProjectUser = require('../models/projectUser');
const Request = require('../models/request');
const RequestType = require('../models/requestType')
const { Op } = require('sequelize');
const createRequestService = async (data, user_id) => {
    try {
        console.log(user_id)
        const {
            ProjectId,
            TypeId,
            Reason,
            Hours
        } = data;
        const userProject = await ProjectUser.findOne({
            where: { UserId: user_id, ProjectId: ProjectId }
        })
        if (!userProject) {
            throw new Error('Ban d trong project nay')
        }
        const newProject = await Request.create({
            UserId: user_id,
            ProjectId,
            Type: TypeId,
            Reason,
            CreatedAt: new Date(),
            StartAt: null,
            EndAt: null,
            Hours
        });

        if (newProject) {
            return {
                status: "Success",
                message: "Tạo thành công",
                data: newProject
            };
        }
    } catch (e) {
        console.log(e)
        return { status: "Err", message: e.message };
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

const approvelRequestService = async (updateStatus, Id) => {
    try {
        console.log(updateStatus)
        const updateRequest = await Request.update({
            Status: updateStatus
        }, { where: { Id: Id } })
        return updateRequest
    } catch (error) {
        return {
            status: 'Err',
            message: error.message
        }
    }
}
const getAllRequestByProjectService = async (ProjectId, day, month, year) => {
    try {
        let whereClause = {
            ProjectId: ProjectId
        };

        // Tạo các điều kiện lọc theo ngày, tháng, và năm
        if (year) {
            whereClause.CreatedAt = {
                [Op.gte]: `${year}-01-01 00:00:00`,
                [Op.lte]: `${year}-12-31 23:59:59`
            };
        }

        if (month) {
            const startMonth = `${year}-${String(month).padStart(2, '0')}-01 00:00:00`;
            const endMonth = new Date(year, month, 0).toISOString().split('T')[0] + ' 23:59:59';
            whereClause.CreatedAt = {
                [Op.gte]: startMonth,
                [Op.lte]: endMonth
            };
        }

        if (day) {
            const formattedDayStart = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} 00:00:00`;
            const formattedDayEnd = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} 23:59:59`;
            whereClause.CreatedAt = {
                [Op.gte]: formattedDayStart,
                [Op.lte]: formattedDayEnd
            };
        }

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

module.exports = {
    createRequestService,
    getAllRequestTypeService,
    approvelRequestService,
    getAllRequestByProjectService
}
