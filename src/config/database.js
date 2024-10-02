const { Sequelize } = require('sequelize');

// Thay đổi thông tin kết nối dưới đây theo cấu hình của bạn
const sequelize = new Sequelize('tsadmin', 'root', '123456', {
    host: 'localhost', // Địa chỉ máy chủ
    dialect: 'mysql', // Hoặc 'postgres', 'sqlite', 'mssql', v.v.
    logging: false, // Đặt là true nếu bạn muốn xem các truy vấn SQL
});

// Kiểm tra kết nối
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối tới cơ sở dữ liệu thành công.');
    } catch (error) {
        console.error('Không thể kết nối tới cơ sở dữ liệu:', error);
    }
};

testConnection();

module.exports = sequelize;