const SalaryUser = require('../models/salaryUser');
const Attendance = require('../models/attendance');
const Request = require('../models/request');
const Users = require('../models/users')
const { Op } = require('sequelize');


const calculateWorkingDays = (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    let workingDays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month - 1, day);
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            workingDays++;
        }
    }

    return workingDays;
};


const calculateDayOff = async (UserId, year, month) => {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;

    const requests = await Request.findAll({
        where: {
            UserId,
            Status: 'Approved',
            Date: {
                [Op.between]: [startDate, endDate]
            }
        },
        attributes: ['Type'],
    });

    let dayOff = 0;

    for (const request of requests) {
        if (request.Type === 3 || request.Type === 4) {
            dayOff += 0.5;
        } else if (request.Type === 5) {
            dayOff += 1;
        }
    }

    return dayOff;
};

const createOrFetchSalaryForMonthService = async (year, month) => {
    try {
        if (!year || !month) {
            throw new Error('Both year and month are required');
        }
        // Lấy tháng và năm hiện tại
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0
        const currentYear = currentDate.getFullYear();

        // // Kiểm tra nếu nhập tháng hiện tại hoặc tháng trong tương lai
        // if (
        //     parseInt(year, 10) > currentYear ||
        //     (parseInt(year, 10) === currentYear && parseInt(month, 10) >= currentMonth)
        // ) {
        //     throw new Error(
        //         `Invalid input: Only salaries for previous months can be processed. Current month is ${currentMonth}/${currentYear}.`
        //     );
        // }

        const Time = `${year}-${month.toString().padStart(2, '0')}`;
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;

        const existingSalaries = await SalaryUser.findAll({
            where: { Time },
            include: [
                {
                    model: Users,
                    attributes: ['Id', 'FullName', 'Salary'],
                },
            ],
        });

        if (existingSalaries.length > 0) {

            return {
                message: `Salaries for ${Time} already exist.`,
                data: existingSalaries,
            };
        }

        const users = await Users.findAll({
            attributes: ['Id', 'Salary'],
        });

        if (!users || users.length === 0) {
            throw new Error('No users found in the database');
        }

        const DayOfMonth = calculateWorkingDays(year, month);

        const salaryResults = [];

        for (const user of users) {

            const UserId = user.Id;
            const baseSalary = parseFloat(user.Salary) || 0;
            const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
            const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
            // Tính số ngày nghỉ phép (DayOff)
            const DayOff = await calculateDayOff(UserId, year, month);
            // Tính số ngày làm việc thực tế

            const attendanceCount = await Attendance.count({
                where: {
                    UserId,
                    Date: {
                        [Op.between]: [startDate, endDate],
                    },
                },
            });


            // Truy vấn tổng FeeMoney từ bảng Attendance


            const Fee = await Attendance.sum('FeeMoney', {
                where: {
                    UserId,
                    Date: {
                        [Op.between]: [startDate, endDate],
                    },
                },
            });
            const DayReal = DayOfMonth - DayOff - attendanceCount;
            const totalFee = Fee + DayReal * 100000
            // Tính SalaryReal (lương thực nhận)
            const SalaryReal = (baseSalary * attendanceCount) / DayOfMonth - (totalFee || 0);

            // Tạo bản ghi SalaryUser với các giá trị tính toán
            const newSalaryUser = await SalaryUser.create({
                UserId,
                SalaryReal,
                Fee: totalFee || 0, // Nếu không có FeeMoney, mặc định là 0
                DayOfMonth,
                DayReal,
                Time,
            });

            salaryResults.push(newSalaryUser);
        }

        return {
            message: `Salaries for ${Time} created successfully.`,
            data: salaryResults,
        };
    } catch (error) {
        throw new Error(error.message || 'Failed to create or fetch SalaryUser');
    }
};

module.exports = { createOrFetchSalaryForMonthService };
