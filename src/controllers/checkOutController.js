const checkOutService = require('../services/checkOutService');


const createCheckOut = async (req, res) => {
    try {
        const user_id = req.user_id
        const response = await checkOutService.createCheckOutService(user_id)
        console.log("respone", response)
        return res.status(200).json({
            status: "Success",
            data: { checkOut: response },
        });
    } catch (e) {
        console.log(e)
        return res.status(404).json({
            status: "Err",
            message: e
        })
    }
}

const getCheckOutUser = async (req, res) => {
    try {
        const user_id = req.user_id
        const { day, month, year } = req.query

        console.log("Request Outfo:", { user_id });
        const response = await checkOutService.getCheckOutUserService(user_id, day, month, year)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            status: "Err",
            message: e
        })
    }
}
module.exports = {
    createCheckOut,
    getCheckOutUser
}