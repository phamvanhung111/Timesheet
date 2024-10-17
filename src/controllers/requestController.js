const requsetService = require('../services/requestService')

const createRequest = async (req, res) => {
    try {
        const user_id = req.user_id;
        const data = req.body;
        const response = await requsetService.createRequestService(data, user_id)
        return res.status(200).json({
            status: 'Success',
            data: response
        });
    }
    catch (e) {
        return res.status(404).json({
            status: "Err",
            message: e
        })
    }
}

const getAllRequestType = async (req, res) => {
    try {
        const response = await requsetService.getAllRequestTypeService()
        return res.status(200).json({
            status: 'Success',
            data: response
        });
    } catch (error) {
        return res.status(404).json({
            status: "Err",
            message: e
        })
    }
}

const approvelRequest = async (req, res) => {
    try {
        const { updateStatus } = req.body
        const Id = req.params.Id
        const approvelRepuest = await requsetService.approvelRequestService(updateStatus, Id)
        return res.status(200).json({
            status: 'Success',
            data: approvelRepuest
        });
    } catch (error) {
        console.log(error);
        return {
            status: 'Err',
            message: error.message
        }
    }
}

const getAllRequestByProject = async (req, res) => {
    try {
        const ProjectId = req.params.ProjectId
        const { day, month, year } = req.query;
        const response = await requsetService.getAllRequestByProjectService(ProjectId, day, month, year)
        return res.status(200).json({
            status: 'Success',
            data: response
        });
    } catch (error) {
        return res.status(404).json({
            status: "Err",
            message: e
        })
    }
}

module.exports = {
    createRequest,
    getAllRequestType,
    approvelRequest,
    getAllRequestByProject
}