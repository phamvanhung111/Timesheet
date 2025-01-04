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

        // Kiểm tra nếu nhập tháng hiện tại hoặc tháng trong tương lai
        if (
            parseInt(year, 10) > currentYear ||
            (parseInt(year, 10) === currentYear && parseInt(month, 10) >= currentMonth)
        ) {
            throw new Error(
                `Invalid input: Only salaries for previous months can be processed. Current month is ${currentMonth}/${currentYear}.`
            );
        }
        const Time = `${year}-${month.toString().padStart(2, '0')}`;
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;

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
                // Tìm user trong mảng users dựa trên Id của salary
                const user = users.find(u => u.Id === salary.UserId); // Điều này giả định rằng `UserId` là trường liên kết giữa `SalaryUser` và `Users`

                if (!user) {
                    return null; // Nếu không tìm thấy user, bỏ qua đối tượng này
                }

                const tmp = {
                    Email: user.Email,
                    FullName: user.FullName,
                    Salary: user.Salary,
                    SalaryReal: salary.SalaryReal, // Lấy giá trị SalaryReal từ SalaryUser
                    Fee: salary.totalFee || 0,    // Tổng phí (đảm bảo có giá trị mặc định là 0 nếu không có)
                    DayReal: salary.DayReal,      // Ngày thực tế
                };

                return tmp;
            }).filter(item => item !== null); // Lọc bỏ các phần tử null nếu không tìm thấy user

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

            tmp = {
                Email,
                FullName,
                Salary: user.Salary,
                SalaryReal,
                Fee: totalFee || 0,
                DayReal
            }

            salaryResults.push(tmp);

        }

        return salaryResults
    } catch (error) {
        throw new Error(error.message || 'Failed to create or fetch SalaryUser');
    }
};

module.exports = { createOrFetchSalaryForMonthService };
