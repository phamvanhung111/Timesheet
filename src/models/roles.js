const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Roles extends Model { }

Roles.init({
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    RoleName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Roles',
    tableName: 'Roles',
    timestamps: false
});

module.exports = Roles;