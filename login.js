'use strict';

const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

const dotenv = require('dotenv');
const { dirname } = require('path');
dotenv.config({ path: 'config.env' });

const mysqlPassword = process.env.MYSQL_PASSWORD;
const port = process.env.PORT || 3000;

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: `${mysqlPassword}`,
	database: 'nodelogin',
});

const app = express();

app.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
	// Render Login Template
	res.sendFile(path.join(__dirname, '/login.html'));
});

app.post('/auth', (req, res) => {
	// Capture the input fields
	let username = req.body.username;
	let password = req.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query(
			'SELECT * FROM accounts WHERE username = ? AND password = ?',
			[username, password],
			function (error, results, fields) {
				// If there is an issue with the query, output the error
				if (error) throw error;
				// If the account exists
				if (results.length > 0) {
					// Authenticate the user
					req.session.loggedin = true;
					req.session.username = username;
					// Redirect to home page
					res.redirect('/home');
				} else {
					res.send('Incorrect Username and/or Password!');
				}
				res.end();
			}
		);
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

app.get('/home', (req, res) => {
	// If user is logged in...
	if (req.session.loggedin) {
		// Output username:
		res.send(`Welcome back, ${req.session.username}!`);
	} else {
		// Else if user is NOT logged in:
		res.send('Please login to view this page!');
	}
	res.end();
});

app.listen(port, () => {
	console.log(`App listening on port ${port}...`);
});
