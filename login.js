'use strict';

const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

const mysqlPassword = process.env.MYSQL_PASSWORD;
console.log(mysqlPassword); // undefined?

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: `${mysqlPassword}`,
	database: 'nodelogin',
});
