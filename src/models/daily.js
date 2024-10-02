const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Daily extends Model { }

Daily.init({
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
    Content: {
        type: DataTypes.TEXT
    },
    Hours: {
        type: DataTypes.DECIMAL(5, 2)
    },
    Date: {
        type: DataTypes.DATEONLY
    },
    CreatedAt: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    modelName: 'Daily',
    tableName: 'Daily',
    timestamps: false
});

module.exports = Daily;