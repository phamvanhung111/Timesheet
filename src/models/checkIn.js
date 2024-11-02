const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class CheckIn extends Model { }

CheckIn.init({
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
    }
}, {
    sequelize,
    modelName: 'CheckIn',
    tableName: 'CheckIn',
    timestamps: false
});

module.exports = CheckIn;