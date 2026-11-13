const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: 'file-uploader',
		resource_type: 'auto',
	},
});

const allowedMimeTypes = [
	'image/jpeg',
	'image/png',
	'image/gif',
	'application/pdf',
];

const fileFilter = (req, file, cb) => {
	if (allowedMimeTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(
			new Error(
				'This file format is not permitted (only JPEG, PNG, GIF, and PDF files can be uploaded).',
			),
			false,
		);
	}
};

const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter
});

module.exports = upload;
