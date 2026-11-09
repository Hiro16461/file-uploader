const { prisma } = require('../lib/prisma');

exports.getUploadForm = (req, res) => {
	res.render('upload');
};

exports.uploadFile = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).send('Files does not select.');
		}

		await prisma.file.create({
			data: {
				name: req.file.originalname,
				size: req.file.size,
				url: `../public/uploads/${req.file.filename}`,
				mimeType: req.file.mimeType,
				userId: req.user.id,
			},
        });
        console.log(`Saved file information`, req.file);
        res.redirect('/')
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error happens...');
	}
};
