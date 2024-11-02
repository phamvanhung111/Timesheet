const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class CheckOut extends Model { }

CheckOut.init({
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
    CheckOut: {
        type: DataTypes.TIME
    }
}, {
    sequelize,
    modelName: 'CheckOut',
    tableName: 'CheckOut',
    timestamps: false
});

module.exports = CheckOut;