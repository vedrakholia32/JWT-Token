const express = require('express');
const db = require('./db');
const app = express();
const Person = require('./models/Person')
require('dotenv').config();
const localAuthMiddleware = require('./auth')

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Middleware Function
const logRequest = (req, res, next) => {
    console.log(`${new Date().toLocaleString()} Request Made to : ${req.originalUrl}`);
    next(); // Move on to the next phase
}


app.get('/',  (req, res) => {
    res.send("Welcome")
})


// Routing
const personRoutes = require('./routes/personRoutes')
app.use('/person', personRoutes)



app.listen(3000, () => {
    console.log('listening on port 3000');
})