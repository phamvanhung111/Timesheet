const UserRouter = require('./userRouter')
const ProjectRouter = require('./projectRouter')
const OrderRouter = require('./orderRouter')
const DailyRouter = require('./dailyRouter')
const RequestRouter = require('./requestRouter')
const AttendanceRouter = require('./attendanceRouter')
const CheckHour = require('./checkRouter')
const { getHomepage } = require("../controllers/homeController");
const { page } = require("../controllers/page");


const routes = (app) => {
    app.get('/', getHomepage);
    app.get('/v1/api', page);
    app.use('/api/user', UserRouter);
    app.use('/api/project/', ProjectRouter);
    app.use('/api/order/', OrderRouter);
    app.use('/api/daily/', DailyRouter);
    app.use('/api/request/', RequestRouter)
    app.use('/api/attendance/', AttendanceRouter)
    app.use('/api/checkHour/', CheckHour)
};


module.exports = routes