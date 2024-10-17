const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Request extends Model { }

Request.init({
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    UserId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'Id'
        }
    },
    ProjectId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Projects',
            key: 'Id'
        }
    },
    Type: {
        type: DataTypes.INTEGER,
        references: {
            model: 'RequestType',
            key: 'Id'
        }
    },
    Reason: {
        type: DataTypes.TEXT
    },
    CreatedAt: {
        type: DataTypes.DATE
    },
    StartAt: {
        type: DataTypes.DATE
    },
    EndAt: {
        type: DataTypes.DATE
    },
    Hours: {
        type: DataTypes.DECIMAL(5, 2)
    },
    Status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending'
    }
}, {
    sequelize,
    modelName: 'Request',
    tableName: 'Request',
    timestamps: false
});




module.exports = Request;