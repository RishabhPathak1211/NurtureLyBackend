const CronJob = require('node-cron');
const patientModel = require('../models/patient');
// const videoModel = require('../models/video');

const initScheduleJobs = () => {
    const premiumVideoUpdate  = CronJob.schedule('0 0 * * *', async () => {
        await patientModel.updateMany({ premium: true }, { updateVideos: true });
    });

    const nonPremiumVideoUpdate = CronJob.schedule('0 0 * * SUN', async () => {
        await patientModel.updateMany({ premium: false }, { updateVideos: true })
    });

    // const getAverageGraphData = CronJob.schedule('0 0 * * *', async () => {
    //     const patients = await patientModel.find({});

    // })

    premiumVideoUpdate.start();
    nonPremiumVideoUpdate.start();
}

module.exports = initScheduleJobs;