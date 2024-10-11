const projectService = require('../services/projectService');

const createProject = async (req, res) => {
    try {
        const createProject = req.body;
        const response = await projectService.createProjectService(createProject)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            status: "Err",
            message: e
        })
    }
}
const getAllProject = async (req, res) => {
    try {
        const projectInfo = await projectService.getAllProjectService();
        return res.status(200).json({
            status: 'Success',
            data: projectInfo
        });
    } catch (e) {
        return res.status(404).json({
            status: 'Err',
            message: e.message
        });
    }
}

const addUsersToProject = async (req, res) => {
    const { projectId, userIds } = req.body;
    if (!projectId || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid projectId or user list.' });
    }

    try {
        const result = await projectService.addUsersToProjectService(userIds, projectId);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
const removeUsersFromProject = async (req, res) => {
    const { projectId, userIds } = req.body;

    if (!projectId || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid projectId or user list.' });
    }

    try {
        const result = await projectService.removeUsersFromProjectService(userIds, projectId)

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        // Xử lý lỗi máy chủ
        console.log(error)
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
const updateProject = async (req, res) => {
    try {
        const Id = req.params.Id;
        const data = req.body;
        console.log('data', data)
        if (!Id) {
            return res.status(200).json({
                status: "Err",
                message: "The Project is require"
            })
        }
        const userUpdate = await projectService.updateProjectById(Id, data);

        return res.status(200).json({
            status: 'Success',
            data: userUpdate
        });
    } catch (error) {
        return res.status(404).json({
            status: 'Err',
            message: error.message
        });
    }
}

module.exports = {
    createProject,
    getAllProject,
    addUsersToProject,
    removeUsersFromProject,
    updateProject
}