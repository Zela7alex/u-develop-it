const express = require('express')
const router = express.Router()
const db = require('../../db/connection')
const inputCheck = require('../../utils/inputCheck')

//! ---- API GET ROUTE for all candidates ----
// Get all the data in candidates table
router.get('/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
    AS party_name
    FROM candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id`; // sql statement to grab from candidates data table with parties name left "JOIN" by corresponding ID 

    db.query(sql, (err, rows) => { // This will show each row in the database as an array of objects when console.logged to console
        if (err) {
            res.status(500).json({ error: err.message }) // 500 means server error while 404 means user request error
            return
        }
        res.json({
            message: 'success',
            data: rows // this will now respond with all the data in candidates table by rows 
        })
    })
});


//! ---- API GET ROUTE for single candidate ----
// Get a single candidate by their ID
// Candidates table was joined with parties table name, therefor API had to be updated to include joining of tables
router.get('/candidates/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
    AS party_name
    FROM candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id
    WHERE candidates.id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => { // in query method, you must sepcify params as well for a specific ID 
        if (err) {
            res.status(400).json({ error: err.message }) // 400 means request wasn't accepted
            return
        }
        res.json({
            message: 'success',
            data: row
        })
    })
});

//! ---- API POST ROUTE for single candidate ----
// Create a candidate
router.post('/candidate', ({ body }, res) => { // { body } is req.body but destructured 
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
            return
        }
        res.json({ 
            message: 'success',
            data: body
        })
    })
});

//! ---- API PUT ROUTE for single candidate ----
// Update a candidate's party
router.put('/candidate/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id')

    if (errors) {
        res.status(400).json({ error: errors })
        return
    };
    
    const sql = 'UPDATE candidates SET party_id = ? WHERE id = ?';
    const params = [req.body.party_id, req.params.id] // fields being updated should always be part of the body
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message })
            // check if a record was found
        } else if (!result.affectedRows) {
            res.json({ 
                message: 'Candidate not found'
            })
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            })
        }
    })
});

//! ---- API DELETE ROUTE for single candidate ----
//You can only test delete  HTTP methods with Insomnia 
router.delete('/api/candidate/:id', (req, res) => {
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

  module.exports = router;