const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class RequestType extends Model { }

RequestType.init({
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    TypeName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'RequestType',
    tableName: 'RequestType',
    timestamps: false
});

module.exports = RequestType;