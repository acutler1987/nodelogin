'use strict';

const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

const dotenv = require('dotenv');
const { dirname } = require('path');
dotenv.config({ path: 'config.env' });

const mysqlPassword = process.env.MYSQL_PASSWORD;

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
