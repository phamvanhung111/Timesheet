const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class WorkingHours extends Model { }

WorkingHours.init({
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
    StartAt: {
        type: DataTypes.FLOAT,
        defaultValue: 8.5
    },
    EndAt: {
        type: DataTypes.FLOAT,
        defaultValue: 17.5
    }
}, {
    sequelize,
    modelName: 'WorkingHours',
    tableName: 'WorkingHours',
    timestamps: false
});

module.exports = WorkingHours;