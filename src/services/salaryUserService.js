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


        const Time = `${year}-${month.toString().padStart(2, '0')}`;


        const existingSalaries = await SalaryUser.findAll({
            where: { Time },
            include: [
                {
                    model: Users,
                    attributes: ['Id', 'Name', 'Salary'],
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

            // Tính số ngày nghỉ phép (DayOff)
            const DayOff = await calculateDayOff(UserId, year, month);

            // Tính số ngày làm việc thực tế
            const DayReal = DayOfMonth - DayOff;

            // Truy vấn tổng FeeMoney từ bảng Attendance
            const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
            const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;

            const totalFee = await Attendance.sum('FeeMoney', {
                where: {
                    UserId,
                    Date: {
                        [Op.between]: [startDate, endDate],
                    },
                },
            });

            // Tính SalaryReal (lương thực nhận)
            const SalaryReal = (baseSalary * DayReal) / DayOfMonth - (totalFee || 0);

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
