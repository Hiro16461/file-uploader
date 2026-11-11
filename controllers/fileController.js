const { prisma } = require('../lib/prisma');
const path = require('path');

exports.getUploadForm = (req, res) => {
	res.render('upload')
}

exports.getFileDetail = async(req, res) => {
	try {
		const fileId = req.params.id;
		const userId = req.user.id;

		const file = await prisma.file.findUnique({
			where: {id:fileId}
		})

		if (!file || file.userId !== userId) {
			return res.status(404).send('File does not find')
		}

		res.render('fileDetail', {file})
	} catch (err) {
		console.error(err);
		res.status(500).send('Failed to retrieve file information.');
	}
};

exports.downloadFile = async (req, res) => {
	try {
		const fileId = req.params.id;
		const userId = req.user.id;

		const file = await prisma.file.findUnique({
			where: {id:fileId}
		})

		if (!file || file.userId !== userId) {
			return res.status(404).send('File does not find')
		}

		const filePath = path.join(__dirname, "../public", file.url);

		res.download(filePath, file.name, (err) => {
			if (err) {
				console.error('download error', err)
				if (!res.headerSent) {
					res.status(500).send('File download failed...')
				}
			}
		})

	} catch (err) {
		console.error(err);
		res.status(500).send('An error occurred during the download process.');
	}
}

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
				url: req.file.path,
				mimeType: req.file.mimetype, 
				userId: req.user.id,
				folderId: folderId || null,
			},
		});

		console.log('Saved file information:', req.file.path);

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
