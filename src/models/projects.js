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
        allowNull: false
    },
    ClientName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Description: {
        type: DataTypes.TEXT
    },
    PM: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'Id'
        }
    },
    QuantityMember: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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