const { prisma } = require('../lib/prisma');
const bcrypt = require('bcryptjs');

exports.getSignupForm = (req, res) => {
	res.render('signup');
};

exports.postSignup = async (req, res, next) => {
	try {
		const { username, password } = req.body;
		if (!username || !password) {
			return res
				.status(400)
				.render('signup', { error: 'Username and password are required.' });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		await prisma.user.create({
			data: {
				username,
				password: hashedPassword,
			},
		});
		res.redirect('/login');
	} catch (err) {
		if (err.code === 'P2002') {
			return res
				.status(400)
				.render('signup', { error: 'Username is already taken.' });
		}
		console.error('Signup error:', err);
		next(err);
	}
};

exports.getLoginForm = (req, res) => {
	res.render('login');
};

exports.logoutUser = (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect('/login');
	});
};
