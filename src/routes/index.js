const UserRouter = require('./userRouter')
const ProductRouter = require('./productRouter')
const OrderRouter = require('./orderRouter')

const { getHomepage } = require("../controllers/homeController");
const { page } = require("../controllers/page");


const routes = (app) => {
    app.get('/', getHomepage);
    app.get('/v1/api', page);
    app.use('/api/user', UserRouter);
    app.use('/api/product/', ProductRouter);
    app.use('/api/order/', OrderRouter)
};


module.exports = routes