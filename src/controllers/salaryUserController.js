const { createSalaryUserService } = require('../services/salaryUserService');

const createSalaryUser = async (req, res) => {
    try {
        const { year, month } = req.body;

        if (!year || !month) {
            throw new Error('All fields (including year and month) are required');
        }
        // Gọi service để tạo SalaryUser
        const newSalaryUser = await createOrFetchSalaryForMonthService(year, month);

        // Trả về kết quả
        return res.status(201).json({
            message: 'SalaryUser created successfully',
            data: newSalaryUser
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message || 'Failed to create SalaryUser'
        });
    }
};

module.exports = { createSalaryUser };