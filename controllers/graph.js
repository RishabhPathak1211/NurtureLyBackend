const graphModel = require('../models/graph');
const ExpressError = require('../utils/ExpressError');

module.exports.getUserGraph = async (req, res, next) => {
    const { user } = req;
    const { category } = req.query;
    if (!user) return next(new ExpressError('Authorization Failed', 403));
    if (!category) return next(ExpressError('Missing Parameters', 401));
    try {
        if (user.patient_id) {
            const graph = await graphModel.findOne({ patientID: user.patient_id, category });
            return res.status(200).json(graph);
        } else if (user.doctor_id) {
            const { patientID } = req.body;
            const graph = await graphModel.findOne({ patientID });
            return res.status(200).json(graph);
        }
        return next(new ExpressError('Invalid Auth', 403));
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}

module.exports.getAverageGraph = async (req, res, next) => {
    const { category } = req.query;
    if (!category) return next(ExpressError('Missing Parameters', 401));
    try {
        const graphs = await graphModel.find({ category });
        const yAxis = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (const graph of graphs) {
            graph.yAxis.forEach((val, i) => {
                yAxis[i] += val;
            })
        }
        yAxis.forEach((val, i) => yAxis[i] /= graphs.length);
        return res.status(200).json({ yAxis, xAxis: graphs[0].xAxis });
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}