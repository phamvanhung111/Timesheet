const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Account extends Model { }

Account.init({
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    UserName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Account',
    tableName: 'Account',
    timestamps: false
});

module.exports = Account;