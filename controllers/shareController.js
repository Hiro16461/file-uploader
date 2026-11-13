const { prisma } = require('../lib/prisma');
const crypto = require('crypto');

exports.createShareLink = async (req, res) => {
	try {
		const folderId = req.params.id;
		const userId = req.user.id;
		const { duration } = req.body;

		const folder = await prisma.folder.findUnique({ where: { id: folderId } });
		if (!folder || folder.userId !== userId) {
			return res.status(403).send('You do not have permission.');
		}

		const days = parseInt(duration, 10) || 1;
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + days);

		const shareToken = crypto.randomUUID();

		await prisma.folder.update({
			where: { id: folderId },
			data: {
				shareToken,
				shareExpiresAt: expiresAt,
			},
		});

		res.redirect(`/folders/${folderId}`);
	} catch (err) {
		console.error(err);
		res.status(500).send('Failed to create share link.');
	}
};

exports.getSharedFolder = async (req, res) => {
	try {
		const { token } = req.params;

		const folder = await prisma.folder.findUnique({
			where: { shareToken: token },
			include: {
				children: true,
				files: true,
			},
		});

		if (
			!folder ||
			!folder.shareExpiresAt ||
			folder.shareExpiresAt < new Date()
		) {
			return res
				.status(404)
				.send('This shared link has expired or does not exist.');
		}

		res.render('sharedFolder', { folder });
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error happened...');
	}
};
