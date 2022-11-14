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
// db.query(`SELECT * FROM candidates`, (err, rows) => { // This wil show each row in the database as an array of objects when console.logged to console
//     console.log(rows)
// })

// Get a single candidate by their ID
// db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
//     if(err) {
//         console.log(err)
//     }
//     console.log(row)
// })

// Delete a single candidate by their ID
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if(err){
//         console.log(err)
//     }
//     console.log(result)
// });

// Create a candidate
 const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) VALUES (?, ?, ?, ?)`;

 const params = [1, 'Ronald', 'Firbank', 1];

 db.query(sql, params, (err, result) => {
    if (err) {
        console.log(err)
    }
    console.log(result)
 });





app.use((req, res) => {
    res.status(404).end() // Default response for any other request noot found
})                        // Always make sure this route is under all other routes 

//? ---- API LISTEN ROUTE -----------------
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`)
})