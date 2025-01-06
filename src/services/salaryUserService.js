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
    const startDate = new Date(Date.UTC(year, month - 1, 1));  // Sử dụng UTC
    const endDate = new Date(Date.UTC(year, month, 0));  // Ngày cuối của tháng hiện tại


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
        console.log("h", dayOff)

    }

    return dayOff;
};


const createOrFetchSalaryForMonthService = async (year, month) => {
    try {
        if (!year || !month) {
            throw new Error('Both year and month are required');
        }

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        if (
            parseInt(year, 10) > currentYear ||
            (parseInt(year, 10) === currentYear && parseInt(month, 10) >= currentMonth)
        ) {
            throw new Error(
                `Invalid input: Only salaries for previous months can be processed. Current month is ${currentMonth}/${currentYear}.`
            );
        }

        const Time = `${year}-${month.toString().padStart(2, '0')}`;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const users = await Users.findAll({
            attributes: ['Id', 'Salary', 'Email', 'FullName', 'Role'],
        });

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
            const result = existingSalaries.map(salary => {
                const user = users.find(u => u.Id === salary.UserId);
                if (!user) return null;

                return {
                    Email: user.Email,
                    FullName: user.FullName,
                    Salary: user.Salary,
                    SalaryReal: salary.SalaryReal,
                    Fee: salary.totalFee,
                    DayReal: salary.DayReal,
                };
            }).filter(item => item !== null);

            return result;
        }

        if (!users || users.length === 0) {
            throw new Error('No users found in the database');
        }

        const DayOfMonth = calculateWorkingDays(year, month);
        const salaryResults = [];

        for (const user of users) {
            const UserId = user.Id;
            const Email = user.Email;
            const FullName = user.FullName;
            const baseSalary = parseFloat(user.Salary) || 0;

            const DayOff = await calculateDayOff(UserId, year, month);

            const attendanceRecords = await Attendance.findAll({
                where: {
                    UserId,
                    Date: {
                        [Op.between]: [startDate, endDate],
                    },
                    RequestId: {
                        [Op.ne]: null, // Chỉ lấy những bản ghi có RequestID
                    },
                },
                include: [{
                    model: Request,
                    attributes: ['Type'],
                    where: {
                        Type: {
                            [Op.in]: [3, 4] // Chỉ quan tâm đến các Request có Type 3 hoặc 4
                        }
                    }
                }],
            });

            let attendanceCount = await Attendance.count({
                where: {
                    UserId,
                    Date: {
                        [Op.between]: [startDate, endDate],
                    },
                },
            });

            // Giảm attendanceCount cho mỗi bản ghi phù hợp
            attendanceCount -= (attendanceRecords.length * 0.5);

            const Fee = await Attendance.sum('FeeMoney', {
                where: {
                    UserId,
                    Date: {
                        [Op.between]: [startDate, endDate],
                    },
                },
            });
            let DayReal = 0;
            const DayNoPermission = DayOfMonth - attendanceCount - DayOff;
            if (user.Id === 2) {
                console.log('d', DayNoPermission)
            }
            let totalFee;
            if (DayNoPermission > 0) {
                totalFee = Fee + DayNoPermission * 100000;
                DayReal = DayOfMonth - DayOff - DayNoPermission
            } else {
                totalFee = Fee;
                DayReal = DayOfMonth - DayOff
            }

            const SalaryReal = Math.ceil(((baseSalary * DayReal) / DayOfMonth - totalFee) / 10000) * 10000;

            await SalaryUser.create({
                UserId,
                SalaryReal,
                Fee: totalFee,
                DayOfMonth,
                DayReal: DayReal,
                Time,
            });

            salaryResults.push({
                Email,
                FullName,
                Salary: user.Salary,
                SalaryReal,
                Fee: totalFee,
                DayReal: DayReal
            });
        }

        return salaryResults;
    } catch (error) {
        throw new Error(error.message || 'Failed to create or fetch SalaryUser');
    }
};


module.exports = { createOrFetchSalaryForMonthService };
