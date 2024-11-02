const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tsadmin', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối tới cơ sở dữ liệu thành công.');
    } catch (error) {
        console.error('Không thể kết nối tới cơ sở dữ liệu:', error);
    }
};

testConnection();

module.exports = sequelize; // Đảm bảo rằng bạn xuất đúng đối tượng sequelize