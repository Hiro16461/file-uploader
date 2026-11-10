const { prisma } = require('../lib/prisma');

exports.getUploadForm = (req, res) => {
	res.render('upload');
};

exports.uploadFile = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).send('No file selected.');
		}

		const { folderId } = req.body;

		await prisma.file.create({
			data: {
				name: req.file.originalname,
				size: req.file.size,
				url: `/uploads/${req.file.filename}`,
				mimeType: req.file.mimetype, 
				userId: req.user.id,
				folderId: folderId || null,
			},
		});

		console.log('Saved file information:', req.file);

		if (folderId) {
			res.redirect(`/folders/${folderId}`); 
		} else {
			res.redirect('/');
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error happened...');
	}
};
