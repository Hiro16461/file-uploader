const { prisma } = require('../lib/prisma');
const crypto = require('crypto');

// 1. ダッシュボード（ルート階層）
exports.getDashboard = async (req, res) => {
	try {
		const userId = req.user.id;

		const folders = await prisma.folder.findMany({
			where: { userId, parentId: null },
			orderBy: { createdAt: 'desc' },
		});
		const files = await prisma.file.findMany({
			where: { userId, folderId: null },
			orderBy: { createdAt: 'desc' },
		});

		res.render('dashboard', { currentFolder: null, folders, files });
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error happened...');
	}
};

// 2. フォルダ作成
exports.createFolder = async (req, res) => {
	try {
		const { name, parentId } = req.body;
		const userId = req.user.id;

		// parentId が空文字 ("") で送られてきた場合は null に変換
		const targetParentId = parentId && parentId.trim() !== '' ? parentId : null;

		await prisma.folder.create({
			data: {
				name,
				userId,
				parentId: targetParentId,
			},
		});

		if (targetParentId) {
			res.redirect(`/folders/${targetParentId}`);
		} else {
			res.redirect('/');
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Failed to create the folder.');
	}
};

// 3. フォルダ詳細
exports.getFolderDetail = async (req, res) => {
	try {
		const folderId = req.params.id;
		const userId = req.user.id;

		const currentFolder = await prisma.folder.findUnique({
			where: { id: folderId },
		});

		if (!currentFolder || currentFolder.userId !== userId) {
			return res.status(404).send('Folder not found');
		}

		const folders = await prisma.folder.findMany({
			where: { userId, parentId: folderId },
			orderBy: { createdAt: 'desc' },
		});
		const files = await prisma.file.findMany({
			where: { userId, folderId: folderId },
			orderBy: { createdAt: 'desc' },
		});

		res.render('dashboard', { currentFolder, folders, files, protocol: req.protocol, host: req.get('host') });
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error happened...');
	}
};

// 4. フォルダ名変更
exports.updateFolder = async (req, res) => {
	try {
		const folderId = req.params.id;
		const { name } = req.body;
		const userId = req.user.id;

		const folder = await prisma.folder.findUnique({ where: { id: folderId } });
		if (!folder || folder.userId !== userId) {
			return res.status(403).send('You are not authorized.');
		}

		await prisma.folder.update({
			where: { id: folderId },
			data: { name },
		});

		if (folder.parentId) {
			res.redirect(`/folders/${folder.parentId}`);
		} else {
			res.redirect('/');
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Failed to rename the folder.');
	}
};

// 5. フォルダ削除
exports.deleteFolder = async (req, res) => {
	try {
		const folderId = req.params.id;
		const userId = req.user.id;
		const folder = await prisma.folder.findUnique({ where: { id: folderId } });

		if (!folder || folder.userId !== userId) {
			return res.status(403).send('You do not have permission');
		}

		await prisma.folder.delete({ where: { id: folderId } });

		if (folder.parentId) {
			res.redirect(`/folders/${folder.parentId}`);
		} else {
			res.redirect('/');
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Failed to delete the folder.');
	}
};
