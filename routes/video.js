const express = require('express');
const videoController = require('../controllers/video');
const auth = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(auth, videoController.fetchVideos);

module.exports = router;