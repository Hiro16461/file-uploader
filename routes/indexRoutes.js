const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController')
const fileController = require('../controllers/fileController');
const upload = require('../config/multer')

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next(); 
    res.redirect('/login')
}

router.get('/', ensureAuthenticated, folderController.getDashboard);

router.post('/folders', ensureAuthenticated, folderController.createFolder);
router.get('/folders/:id', ensureAuthenticated, folderController.getFolderDetail);
router.post('/folders/:id/update', ensureAuthenticated, folderController.updateFolder)
router.post('/folders/:id/delete', ensureAuthenticated, folderController.deleteFolder);

router.post('/upload', ensureAuthenticated, upload.single('file'), fileController.uploadFile);

module.exports = router;