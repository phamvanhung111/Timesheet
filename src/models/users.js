const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Users extends Model { }

Users.init({
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'Id'
    },
    FullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Age: {
        type: DataTypes.STRING
    },
    Role: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Roles',
            key: 'Id'
        }
    },
    Email: {
        type: DataTypes.STRING
    },
    Account: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Account',
            key: 'Id'
        }
    },
    Bank: {
        type: DataTypes.STRING,
    },
    BankAccount: {
        type: DataTypes.STRING
    },
    Address: {
        type: DataTypes.STRING
    },
    Indentify: {
        type: DataTypes.STRING
    },
    Created: {
        type: DataTypes.DATE
    },
    Salary: {
        type: DataTypes.DECIMAL(10, 2)
    },
    Sex: {
        type: DataTypes.STRING
    },
    PhoneNumber: {
        type: DataTypes.STRING
    },
    Position: {
        type: DataTypes.STRING
    },
    Status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'Users',
    tableName: 'Users',
    timestamps: false
});

module.exports = Users;