const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Attendance extends Model { }

Attendance.init({
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
    Date: {
        type: DataTypes.DATEONLY
    },
    CheckIn: {
        type: DataTypes.TIME
    },
    CheckOut: {
        type: DataTypes.TIME
    },
    LateMinutes: {
        type: DataTypes.INTEGER
    },
    EarlyLeaveMinutes: {
        type: DataTypes.INTEGER
    },
    IsLate: {
        type: DataTypes.BOOLEAN
    },
    IsEarlyLeave: {
        type: DataTypes.BOOLEAN
    },
    WorkingHours: {
        type: DataTypes.DECIMAL(5, 2)
    },
    ProjectId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Projects',
            key: 'Id'
        }
    },
    RequestId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Request',
            key: 'Id'
        }
    },
    Status: {
        type: DataTypes.STRING
    },
    CreatedAt: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    modelName: 'Attendance',
    tableName: 'Attendance',
    timestamps: false
});

module.exports = Attendance;