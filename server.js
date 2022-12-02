const express = require('express')
const db = require('./db/connection')
const apiRoutes = require('./routes/apiRoutes')

const PORT = process.env.PORT || 3001 // port online
const app = express()

//^------ Middleware functions ----------- 
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

app.use('/api', apiRoutes) // by adding /api prefix here, it can then be removed from all individual route expressions

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end()
  });
//^---------------------------------------

//? ---- API LISTEN ROUTE -----------------
db.connect(err => {
    if(err) throw err
    console.log('Database connected.')
app.listen(PORT, () => {
    console.log(`Server now on port ${PORT}`)
 })
});