const checkOutService = require('../services/checkOutService');


const createCheckOut = async (req, res) => {
    try {
        const user_id = req.user_id
        const data = req.body

        const response = checkOutService.createCheckOutService(data, user_id)

        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            status: "Err",
            message: e
        })
    }
}
module.exports = {
    createCheckOut
}