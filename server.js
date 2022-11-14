const express = require('express')

const PORT = process.env.PORT || 3001 // port online

const app = express()

const mysql = require('mysql2') // requiring in order to connect to MySQL database

const inputCheck = require('./utils/inputCheck')

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

//! ---- API GET ROUTE for all candidates ----
// Get all the data in the database
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`; // sql statement to grab from candidates data table

    db.query(sql, (err, rows) => { // This will show each row in the database as an array of objects when console.logged to console
        if (err) {
            res.status(500).json({error: err.message}) // 500 means server error while 404 means user request error
            return; 
        }
        res.json({
            message: 'success',
            data: rows // this will now respond with all the data in candidates table by rows 
        })
    })
});


//! ---- API GET ROUTE for single candidate ----
// Get a single candidate by their ID
app.get('/api/candidates/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => { // in query method, you must sepcify params as well for a specific ID 
        if (err) {
            res.status(400).json({ error: err.message }) // 400 means request wasn't accepted
            return;
        }
        res.json({
            message: 'success',
            data: row
        })
    })
});

//! ---- API DELETE ROUTE for single candidate ----
//You can only test delete  HTTP methods with Insomnia 
app.delete("/api/candidate/:id", (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  // Delete a single candidate by their ID
  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) { // if there is no candidate by that ID
      res.json({
        message: "Candidate not found", // this message will respond if no candidate found
      });
    } else {
      res.json({
        message: "deleted",
        changes: result.affectedRows,
        id: req.params.id,
      })
    }
  })
});

//! ---- API POST ROUTE for single candidate ----


// Create a candidate
app.post('/api/candidate', ({ body }, res) => { // { body } is req.body but destructured 
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected') //input check anon function is in inputCheck.js module file -- this module must be required at top of server
    if(errors) {
        res.status(400).json({ error: errors})
        return
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES(?,?,?)`;

    const params = [body.first_name, body.last_name, body.industry_connected] // this is grabbing params being posted by user to req.body or { body }

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return;
        }
        res.json({ 
            message: 'success',
            data: body
        })
    })
});






//? ---- API LISTEN ROUTE -----------------
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`)
})