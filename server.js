const express = require('express')

const PORT = process.env.PORT || 3001 // port online

const app = express()

//^------ Middleware functions ----------- 
app.use(express.urlencoded({ extended: false}))
app.use(express.json())
//^---------------------------------------


app.use((req, res) => {
    res.status(404).end() // Default response for any other request noot found
})                        // Always make sure this route is under all other routes 

//? ---- API LISTEN ROUTE -----------------
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`)
})