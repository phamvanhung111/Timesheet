const Projects = require('../models/projects')
const Users = require('../models/users')
const ProjectUser = require('../models/projectUser')
const { Op } = require('sequelize');
const createProjectService = async (createProject, userId, roleId) => {
    try {
        const {
            ProjectName,
            ClientName,
            Description
        } = createProject;
        console.log(createProject);
        const intRole = parseInt(roleId, 10);
        const intUserId = parseInt(userId, 10);
        if (intRole !== 1) {
            throw new Error('Err');
        }

        const newProject = await Projects.create({
            ProjectName,
            ClientName,
            Description,
            PM: intUserId,
            Created: new Date(),
            Status: true
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

const getAllProjectService = async () => {
    try {
        const getProjectInfoById = await Projects.findAll()
        if (getProjectInfoById === null) {
            throw new Error('Project not found');
        }
        return getProjectInfoById;
    } catch (error) {

    }
}

const addUsersToProjectService = async (userIds, projectId) => {
    try {
        const project = await Projects.findOne({
            where: { Id: projectId }
        });
        if (!project) {
            throw new Error('Project not found.');
        }

        // Lấy UserId của người quản lý từ bảng Projects
        const managerId = project.PM;

        // Kiểm tra nếu người quản lý đã tồn tại trong ProjectUser chưa
        const existingManagerRecord = await ProjectUser.findOne({
            where: { UserId: managerId, ProjectId: projectId }
        });

        // Nếu người quản lý chưa có, thì thêm vào
        if (!existingManagerRecord) {
            await ProjectUser.create({ UserId: managerId, ProjectId: projectId });
            project.QuantityMember = (project.QuantityMember || 0) + 1;
        }

        // Thêm các thành viên khác, nếu chưa có
        const promises = userIds.map(async (userId) => {
            const existingRecord = await ProjectUser.findOne({
                where: { UserId: userId, ProjectId: projectId }
            });

            // Nếu chưa có bản ghi trong ProjectUser thì thêm mới
            if (!existingRecord) {
                await ProjectUser.create({ UserId: userId, ProjectId: projectId });
                project.QuantityMember = (project.QuantityMember || 0) + 1;
            } else {
                throw new Error(`User ID ${userId} đã tồn tại trong dự án`);
            }
        });

        // Chờ tất cả các lời hứa hoàn thành
        await Promise.all(promises);

        // Lưu lại số lượng thành viên vào bảng Projects
        await project.save();

        return { success: true, message: 'Users added to project successfully.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
};

const removeUsersFromProjectService = async (userIds, projectId) => {
    try {
        const project = await Projects.findOne({
            where: { Id: projectId }
        });
        if (!project) {
            throw new Error('Project not found.');
        }

        const promises = userIds.map(async (userId) => {
            const existingRecord = await ProjectUser.findOne({
                where: { UserId: userId, ProjectId: projectId }
            });
            if (existingRecord) {
                await ProjectUser.destroy({
                    where: { UserId: userId, ProjectId: projectId }
                });

                project.QuantityMember = (project.QuantityMember || 0) - 1;
            } else {
                throw new Error('User not found in project.');
            }
        });

        await Promise.all(promises);

        await project.save();

        return { success: true, message: 'Users removed from project successfully.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
};
const updateProjectById = async (Id, data) => {
    try {
        const projectId = await Projects.findOne({ where: { Id: Id } });
        if (projectId === null) {
            return { status: 'Err', message: 'Project not define' };
        }
        const {
            ClientName,
            Description,
            PM
        } = data;
        const updateProject = await Projects.update({
            ClientName,
            Description,
            PM
        }, {
            where: { Id: Id }
        });
        if (updateProject) {
            return {
                status: "Success",
                message: "Update Project thành công",
            };
        }

    } catch (error) {
        throw new Error(error.message);
    }
};

const searchProjectByNameService = async (projectName) => {
    try {
        const projects = await Projects.findAll({
            where: {
                ProjectName: {
                    [Op.like]: `%${projectName}%` // Sử dụng LIKE cho MySQL
                }
            }
        });
        
        if (!projects || projects.length === 0) {
            throw new Error('No projects found with this name.');
        }
        
        return projects;
    } catch (error) {
        throw new Error(error.message || 'Error searching projects by name.');
    }
};

const getProjectByUserIdService = async (userId) => {
    try {
        const userIdInt = parseInt(userId, 10); // Ép kiểu userId thành số nguyên

        if (isNaN(userIdInt)) {
            throw new Error('Invalid user ID format');
        }

        const projectUserRecords = await ProjectUser.findAll({
            where: {
                UserId: userIdInt
            }
        });
        console.log(projectUserRecords)

        if (!projectUserRecords || projectUserRecords.length === 0) {
            throw new Error('No projects found for this user.');
        }

        const projectIds = projectUserRecords.map(record => record.ProjectId);

        const projects = await Projects.findAll({
            where: {
                id: projectIds
            }
        });

        return projects;
    } catch (error) {
        throw new Error(error.message || 'Error retrieving projects by user ID.');
    }
};

module.exports = {
    createProjectService,
    getAllProjectService,
    addUsersToProjectService,
    removeUsersFromProjectService,
    updateProjectById,
    searchProjectByNameService,
    getProjectByUserIdService
}