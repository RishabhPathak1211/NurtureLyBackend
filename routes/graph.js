const express = require('express');
const graphControllers = require('../controllers/graph');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/user', auth, graphControllers.getUserGraph);
router.get('/average', auth, graphControllers.getAverageGraph);

module.exports = router;