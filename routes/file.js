const express = require('express');
const multer = require('multer');
const fileControllers = require('../controllers/file');
const auth = require('../middlewares/auth');
const { storage } = require('../utils/Cloudinary');

const router = express.Router();


const upload = multer({ storage: storage });

router.route('/')
    .get(auth, fileControllers.getFileList)
    .post(auth, upload.single('file'), fileControllers.sendFile);

module.exports = router;