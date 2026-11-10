const { prisma } = require('../lib/prisma');
const bcrypt = require('bcryptjs');

exports.getSignupForm = (req, res) => {
    res.render('signup');
}

exports.postSignup = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })
        res.redirect('/login')
    } catch (err) {
        console.error(err)
        res.status(500).send('Error occurred during user registration')
    }
}

exports.getLoginForm = (req, res) => {
    res.render('login')
}

exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err) }
        res.redirect('/')
    })
}