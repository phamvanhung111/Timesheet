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
<<<<<<< HEAD
        const { projectId } = req.params;
        const { day, month, year } = req.body;

        const dailyRecords = await dailyService.getDailyByDateRangeService(projectId, day, month, year);
=======
        const user_id = req.user_id;
        const { startDate, endDate } = req.body;
        const dailyRecords = await dailyService.getDailyByTimeRangeService(startDate, endDate, user_id);
>>>>>>> ae77fae5e3723cd423850eb3c992139a07de3ec7
        if (Array.isArray(dailyRecords) && dailyRecords.length === 0) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }

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
    const { projectId } = req.params;
    const { day, month, year } = req.body;
    const user_id = req.user_id;
    console.log("alo", projectId)
    try {
        const dailyUser = await dailyService.getDailyByUserService(projectId, user_id, day, month, year);
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