const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { prisma } = require('../lib/prisma');

passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await prisma.user.findUnique({ where: { username } });
			if (!user) {
				return done(null, false, { message: 'Username does not correct.' });
			}

			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return done(null, false, { message: 'Password does not correct.' });
			}
			return done(null, user);
		} catch (err) {
			return done(err);
		}
	}),
);

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = prisma.user.findUnique({ where: { id } })
        done(null, user);
    } catch (err) {
        done(err)
    }
})