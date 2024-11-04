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
        const requestId = req.params.Id;

        const { Status } = req.body;

        const result = await requsetService.approvelRequestService(requestId, Status);

        if (result.status === 404) {
            return res.status(404).json({
                status: 'Error',
                message: result.message
            });
        } else if (result.status === 500) {
            return res.status(500).json({
                status: 'Error',
                message: result.message
            });
        }

        return res.status(200).json({
            status: 'Success',
            data: result.message,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Error',
            message: error.message
        });
    }
};

const updateHourandType = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        console.log(requestId)
        const user_id = req.user_id

        const { newHours, newType } = req.body;

        const result = await requsetService.updateRequestHoursAndTypeService(user_id, requestId, newHours, newType);

        if (result.status === 404) {
            return res.status(404).json({
                status: 'Error',
                message: result.message
            });
        } else if (result.status === 500) {
            return res.status(500).json({
                status: 'Error',
                message: result.message
            });
        }

        return res.status(200).json({
            status: 'Success',
            data: result.message,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'Error',
            message: error.message
        });
    }
};


const getAllRequestByProject = async (req, res) => {
    try {
        const ProjectId = req.params.ProjectId
        const { day, month, year } = req.body;
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
const getAllRequestByUser = async (req, res) => {
    try {
        const userid = req.user_id;
        const UserId = req.params.UserId;
        const role = req.role;
        const { day, month, year } = req.body;
        console.log({ userid, role, UserId });

        const response = await requsetService.getAllRequestByUserService(userid, role, UserId, day, month, year)

        return res.status(200).json({
            status: 'Success',
            data: response
        });
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            status: "Err",
            message: error
        })
    }
}




module.exports = {
    createRequest,
    getAllRequestType,
    approvelRequest,
    getAllRequestByProject,
    getAllRequestByUser,
    updateHourandType
}