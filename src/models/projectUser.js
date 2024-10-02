const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class ProjectUser extends Model { }

ProjectUser.init({
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ProjectId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Projects',
            key: 'Id'
        }
    },
    UserId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'Id'
        }
    }
}, {
    sequelize,
    modelName: 'ProjectUser',
    tableName: 'ProjectUser',
    timestamps: false
});

module.exports = ProjectUser;