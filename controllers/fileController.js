const { prisma } = require('../lib/prisma');

// 1. アップロードフォーム表示
exports.getUploadForm = (req, res) => {
	res.render('upload');
};

// 2. ファイル詳細表示
exports.getFileDetail = async (req, res) => {
	try {
		const fileId = req.params.id; // parseInt は不要
		const userId = req.user.id;

		const file = await prisma.file.findUnique({
			where: { id: fileId },
		});

		if (!file || file.userId !== userId) {
			return res.status(404).send('File not found');
		}

		res.render('fileDetail', { file });
	} catch (err) {
		console.error(err);
		res.status(500).send('Failed to retrieve file information.');
	}
};

// 3. ファイルダウンロード（Cloudinary URLへリダイレクト）
exports.downloadFile = async (req, res) => {
	try {
		const fileId = req.params.id; // parseInt は不要
		const userId = req.user.id;

		const file = await prisma.file.findUnique({
			where: { id: fileId },
		});

		if (!file || file.userId !== userId) {
			return res.status(404).send('File not found');
		}

		res.redirect(file.url);
	} catch (err) {
		console.error(err);
		res.status(500).send('An error occurred during the download process.');
	}
};

// 4. ファイルアップロード処理
exports.uploadFile = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).send('No file selected.');
		}

		const { folderId } = req.body;
		// 空文字 ("") の場合は null に変換
		const targetFolderId = folderId && folderId.trim() !== '' ? folderId : null;

		await prisma.file.create({
			data: {
				name: req.file.originalname,
				size: req.file.size,
				url: req.file.path,
				mimeType: req.file.mimetype,
				userId: req.user.id,
				folderId: targetFolderId,
			},
		});

		console.log('Saved file information:', req.file.path);

		if (targetFolderId) {
			res.redirect(`/folders/${targetFolderId}`);
		} else {
			res.redirect('/');
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error happened...');
	}
};
