const express = require('express')

const PORT = process.env.PORT || 3001 // port online

const app = express()

const mysql = require('mysql2') // requiring in order to connect to MySQL database

//^------ Middleware functions ----------- 
app.use(express.urlencoded({ extended: false}))
app.use(express.json())
//^---------------------------------------

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

// Query the database to test the connection
db.query(`SELECT * FROM candidates`, (err, rows) => { // This wil show each row in the database as an array of objects when console.logged to console
    console.log(rows)
})


app.use((req, res) => {
    res.status(404).end() // Default response for any other request noot found
})                        // Always make sure this route is under all other routes 

//? ---- API LISTEN ROUTE -----------------
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`)
})