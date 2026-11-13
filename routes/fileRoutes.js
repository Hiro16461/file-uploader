const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const upload = require('../config/cloudinary');
const multer = require('multer');
const isAuth = require('../middleware/isAuth');

router.get('/upload', isAuth, fileController.getUploadForm);
router.post(
	'/upload',
	isAuth,
	(req, res, next) => {
		upload.single('file')(req, res, (err) => {
			if (err instanceof multer.MulterError) {
				if (err.code === 'LIMIT_FILE_SIZE') {
					return res
						.status(400)
						.send('Error: File size is too large (the limit is 5MB)');
				}
				return res.status(400).send(`Upload error: ${err.message}`);
			} else if (err) {
				return res.status(400).send(`Error: ${err.message}`);
			}
			next();
		});
	},
	fileController.uploadFile,
);
router.get('/files/:id', isAuth, fileController.getFileDetail);
router.get(
	'/files/:id/download',
	isAuth,
	fileController.downloadFile,
);

module.exports = router;
