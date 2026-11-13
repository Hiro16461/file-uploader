const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController')
const isAuth = require('../middleware/isAuth');

router.post('/folders/:id/share', isAuth, shareController.createShareLink);
router.get('/share/:token', shareController.getSharedFolder);

module.exports = router;