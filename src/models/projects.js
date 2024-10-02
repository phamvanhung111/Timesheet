const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Projects extends Model { }

Projects.init({
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ProjectName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    PM: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'Id'
        }
    },
    Created: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    modelName: 'Projects',
    tableName: 'Projects',
    timestamps: false
});

module.exports = Projects;