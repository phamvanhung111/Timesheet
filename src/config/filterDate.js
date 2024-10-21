const { Op } = require('sequelize');

const generateCreateAtFilter = (day, month, year) => {
    let dateFilter = {};

    // Nếu có 'year', thiết lập phạm vi cho cả năm trước
    if (year) {
        dateFilter[Op.gte] = `${year}-01-01 00:00:00`;
        dateFilter[Op.lte] = `${year}-12-31 23:59:59`;
    }

    // Nếu có 'month', giới hạn phạm vi theo tháng, ghi đè phạm vi của 'year'
    if (month) {
        const startMonth = `${year}-${String(month).padStart(2, '0')}-01 00:00:00`;
        const endMonth = new Date(year, month, 0).toISOString().split('T')[0] + ' 23:59:59';
        dateFilter[Op.gte] = startMonth;
        dateFilter[Op.lte] = endMonth;
    }

    // Nếu có 'day', ghi đè phạm vi theo ngày
    if (day) {
        const formattedDayStart = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} 00:00:00`;
        const formattedDayEnd = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} 23:59:59`;
        dateFilter[Op.gte] = formattedDayStart;
        dateFilter[Op.lte] = formattedDayEnd;
    }

    return dateFilter;
};


const generateDateFilter = (day, month, year) => {
    let dateFilter = {};

    if (year) {
        dateFilter[Op.gte] = `${year}-01-01`;
        dateFilter[Op.lte] = `${year}-12-31`;
    }

    if (month) {
        const startMonth = `${year}-${String(month).padStart(2, '0')}-01`;
        const endMonth = new Date(year, month, 0).toISOString().split('T')[0];
        dateFilter[Op.gte] = startMonth;
        dateFilter[Op.lte] = endMonth;
    }

    if (day) {
        const formattedDay = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dateFilter[Op.gte] = formattedDay;
        dateFilter[Op.lte] = formattedDay;
    }

    return dateFilter;
};

module.exports = {
    generateCreateAtFilter,
    generateDateFilter

};
