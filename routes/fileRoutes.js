const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const upload = require('../config/multer');

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

router.get('/upload', ensureAuthenticated, fileController.getUploadForm);
router.post('/upload', ensureAuthenticated, upload.single('file'), fileController.uploadFile)
router.get('/files/:id', ensureAuthenticated, fileController.getFileDetail)
router.get('/files/:id/download', ensureAuthenticated, fileController.downloadFile)

module.exports = router;