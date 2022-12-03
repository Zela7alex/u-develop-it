const express = require('express')
const router = express.Router()
const db = require('../../db/connection')
const inputCheck = require('../../utils/inputCheck')

//! ---- API GET ROUTE all voters----
router.get('/voters', (req, res) => {
    const sql = `SELECT * FROM voters ORDER BY last_name DESC`
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return;
        }
    res.json({ 
        message: 'success',
        data: rows,
    })
  })
});

//! ---- API GET ROUTE for voter----
router.get('/voter/:id', (req, res) => {
    const sql = `SELECT * FROM voters WHERE id = ?`
    const params = [req.params.id]

    db.query(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          res.json({
            message: 'success',
            data: rows
        })
    })
});

//! ---- API POST ROUTE for voter----
router.post('/voter', ({ body }, res) => {
    // Data validation
    const errors = inputCheck(body, 'first_name', 'last_name', 'email');
    if (errors) {
    res.status(400).json({ error: errors });
    return;
    }

    const sql = `INSERT INTO voters (first_name, last_name, email) VALUES (?,?,?)`
    const params = [body.first_name, body.last_name, body.email]

    db.query(sql, params, (err,result) => {
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

//! ---- API PUT ROUTE for voter email----
// This api will update voter emails

router.put('/voter/:id', (req, res) => {
    // Data validation
    const errors = inputCheck(req.body, 'email');
    if (errors) {
      res.status(400).json({ error: errors });
      return
    }
  
    const sql = `UPDATE voters SET email = ? WHERE id = ?`;
    const params = [req.body.email, req.params.id];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
      } else if (!result.affectedRows) {
        res.json({
          message: 'Voter not found'
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

  //! ---- API DELETE ROUTE for voter----
  router.delete('/voter/:id', (req, res) => {
    const sql = `DELETE FROM voters WHERE id = ?`;
  
    db.query(sql, req.params.id, (err, result) => {
      if (err) {
        res.status(400).json({ error: res.message });
      } else if (!result.affectedRows) {
        res.json({
          message: 'Voter not found'
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