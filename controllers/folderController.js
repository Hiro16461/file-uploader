const { prisma } = require('../lib/prisma');

exports.getDashboard = async (req, res) => {
	try {
		const userId = req.user.id;

		const folders = await prisma.folder.findMany({
			where: { userId, parentId: null },
		});
		const files = await prisma.file.findMany({
			where: { userId, folderId: null },
		});

		res.render('dashboard', { currentFolder: null, folders, files });
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error happened...');
	}
};

exports.createFolder = async (req, res) => {
	try {
		const { name, parentId } = req.body;
		await prisma.folder.create({
			data: {
				name,
				userId: req.user.id,
				parentId: parentId || null,
			},
		});

		if (parentId) {
			res.redirect(`/folders/${parentId}`);
		} else {
			res.redirect('/');
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Failed to create the folder.');
	}
};

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
		});
		const files = await prisma.file.findMany({
			where: { userId, folderId },
		});

		res.render('dashboard', { currentFolder, folders, files });
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error happened...');
	}
};

exports.deleteFolder = async (req, res) => {
    try {
        const folderId = req.params.id;
        const folder = await prisma.folder.findUnique({ where: { id: folderId } })
        
        if (!folder || folder.userId !== req.user.id) {
            return res.status(403).send("You do not have permission")
        }

        await prisma.folder.delete({ where: { id: folderId } })
        
        if (folder.parentId) {
            res.redirect(`/folders/${folder.parentId}`)
        } else {
            res.redirect('/')
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to delete the folder.');
    }
}