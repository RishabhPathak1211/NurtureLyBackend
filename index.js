if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');

const ExpressError = require('./utils/ExpressError');
const Scheduler = require('./utils/Scheduler');

const doctorRoutes = require('./routes/doctor');
const patientRoutes = require('./routes/patient');
const videoRoutes = require('./routes/video');
const appointmentRoutes = require('./routes/appointment');
const fileRoutes = require('./routes/file');
const graphRoutes = require('./routes/graph');

const dbURL = process.env.DB_URL;
mongoose.connect(dbURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => console.log('Database Connected'));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/doctor', doctorRoutes);
app.use('/api/v1/patient', patientRoutes);
app.use('/api/v1/video', videoRoutes);
app.use('/api/v1/appointment', appointmentRoutes);
app.use('/api/v1/file', fileRoutes);
app.use('/api/v1/graph', graphRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Server Running' });
});

app.use('*', (req, res, next) => { throw new ExpressError('Invalid Url Request', 404) });

app.use((err, req, res, next) => {
    const { message = 'Server Error', status = 500 } = err;
    return res.status(500).send(message);
})

Scheduler();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${ port }`));