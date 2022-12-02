const express = require('express')
const router = express.Router()
const db = require('../../db/connection')

//! ---- API GET ROUTE all parties----
router.get('/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return
        }
        res.json({
            message: 'success',
            data: rows
        })
    })
});

//! ---- API GET ROUTE for single party ID ----
router.get('/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`
    const params = [req.params.id]
    db.query(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }
        res.json({ 
            message: 'success',
            data: rows
        })
    })
});

//! ---- API DELETE ROUTE for single party ID ----
router.delete('/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`
    const params = [req.params.id]
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message })
        } else if (!result.affectedRows) { // checks if anything was deleted
            res.json({ 
                message: 'Party not found'
            })
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            })
        }
    })
});

module.exports = router;