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


        const requestDate = updateRequest.CreatedAt
        const requestUserId = updateRequest.UserId

        const attendance = await Attendance.update({

        })

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


module.exports = {
    createRequestService,
    getAllRequestTypeService,
    approvelRequestService,
    getAllRequestByProjectService,
    getAllRequestByUserService
}
