const dailyService = require('../services/dailyService');

const createDaily = async (req, res) => {
    try {
        const user_id = req.user_id
        const createDaily = req.body;
        const response = await dailyService.createDailyService(createDaily, user_id)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            status: "Err",
            message: e
        })
    }
}

const getDailyByTimeRange = async (req, res) => {
    try {
        const user_id = req.user_id;
        const { month, year } = req.body; // Không bắt buộc

        const dailyRecords = await dailyService.getDailyByTimeRangeService(month, year, user_id);

        return res.status(200).json({
            status: 'Success',
            data: dailyRecords
        });
    } catch (error) {
        return res.status(500).json({
            status: 'Error',
            message: error.message
        });
    }
};
const getDailyByUser = async (req, res) => {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate
    console.log(req.body)
    const user_id = req.user_id;
    try {
        const dailyUser = await dailyService.getDailyByUserService(user_id, startDate, endDate);
        if (Array.isArray(dailyUser) && dailyUser.length === 0) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
        return res.status(200).json({
            status: 'Success',
            data: dailyUser
        });
    } catch (error) {
        return res.status(500).json({
            status: 'Error',
            message: error.message
        });
    }
};
const updateDaily = async (req, res) => {
    try {
        const Id = req.params.Id
        const updateDaily = req.body;
        const response = await dailyService.updateDailyService(updateDaily, Id)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            status: "Err",
            message: e
        })
    }
}
module.exports = {
    createDaily,
    getDailyByTimeRange,
    getDailyByUser,
    updateDaily

}