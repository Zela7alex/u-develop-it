const mysql = require('mysql2') // requiring in order to connect to MySQL database

//** FUNCTION - connects the application to the MySQL database */
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: '',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

module.exports = db;