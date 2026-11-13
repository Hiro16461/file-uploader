require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { prisma } = require('./lib/prisma');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const path = require('path');

require('./config/passport');

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static(path.join(__dirname, "public/uploads")))

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
	res.locals.currentUser = req.user || null;
	next();
});

const indexRoutes = require('./routes/indexRoutes')
const fileRoutes = require('./routes/fileRoutes')
const authRoutes = require('./routes/authRoutes');
const shareRoutes = require('./routes/shareRoutes');

app.use('/', indexRoutes)
app.use('/', fileRoutes);
app.use('/', authRoutes);
app.use('/', shareRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
