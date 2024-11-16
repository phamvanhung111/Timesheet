const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class SalaryUser extends Model { }

SalaryUser.init({
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
    SalaryReal: {
        type: DataTypes.INTEGER
    },
    Fee: {
        type: DataTypes.INTEGER
    },
    DayOfMonth: {
        type: DataTypes.INTEGER
    },
    DayReal: {
        type: DataTypes.INTEGER
    },
    Time: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^\d{4}-(0[1-9]|1[0-2])$/, // Định dạng YYYY-MM
        }
    }
}, {
    sequelize,
    modelName: 'SalaryUser',
    tableName: 'SalaryUser',
    timestamps: false
});

module.exports = SalaryUser;