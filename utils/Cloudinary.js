const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const videoModel = require('../models/video');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    api_key: process.env.CLOUDINARY_API_KEY 
});

// const dbURL = process.env.DB_URL;
// const dbURL = 'mongodb://127.0.0.1:27017/NurtureLy';
const dbURL = 'mongodb+srv://accensusdevelopers:admin@nurturelycluster.9rodexj.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => console.log('Database Connected'));

const func = async () => {
    const res = await cloudinary.search.expression('folder:NurtureLy').execute();
    const links = res.resources.map((item, i) => {
        let title = item.filename.split('_').slice(0, -1).join(' ');
        let description = `This is a demo description of the video ${title}. I dont know what to say about it but I need to say something about it so that it seems like this is a large description and fills the page. Oh well, guess I just did lmao`;
        let categories = ['Cognitive', 'Fine Motor', 'Sensory', 'Gross Motor', 'Speech'];
        return {
            link: item.secure_url,
            title,
            description,
            monthMin: 0,
            monthMax: 3,
            difficulty: (i < 15) ? 3 : 4,
            category: categories[(i % 5)],
            thumbnail: null
        }
    });
    await videoModel.deleteMany({});
    links.forEach(async (item) => {
        await videoModel.create({ ...item });
    })
    console.log('done');
}

func();