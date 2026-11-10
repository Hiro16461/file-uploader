require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { prisma } = require('./lib/prisma');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');

require('./config/passport');

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static('/public/uploads'))

app.use(
	session({
		cookie: {
			maxAge: 7 * 24 * 60 * 60 * 1000,
		},
		secret: process.env.SESSION_SECRET || 'secret',
		resave: false,
		saveUninitialized: false,
		store: new PrismaSessionStore(prisma, {
			checkPeriod: 2 * 60 * 1000,
			dbRecordIdIsSessionId: true,
			dbRecordIdFunction: undefined,
		}),
	}),
);

app.use(passport.session());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

const fileRoutes = require('./routes/fileRoutes')
const authRoutes = require('./routes/authRoutes');

app.use('/', fileRoutes);
app.use('/', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
