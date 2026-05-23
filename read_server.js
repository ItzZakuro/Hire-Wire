/*
    This code has 5 main functions:
        1. Start the server
        2. Give frontend access
        3. Handle JSON data
        4. Connect to the database
        5. Create an API route

    To run this code, use the terminal and type...
        node server.js

    Test the api, connection, and conversion to JSON by pasting these URLs into your browser:
        http://localhost:3000/api/jobListings
        http://localhost:3000/api/jobSeekers
*/


/* -- MAIN DATABASE CONNECTION STUFF -- */
// import libraries
const express = require("express"); // framework for web server
const mysql = require("mysql2"); // to connect to MySQL database
const cors = require("cors"); // access link for frontend to backend

const app = express(); // create server instance
app.use(cors()); // allow requests from frontend (connecting to localhost)
app.use(express.json()); // allow server to read JSON

// give database connection info
const db = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "PotatoFarm28",
  database: "hirewiredb"
});

// try to connect to database
db.connect(err => {
  if (err) {
    console.error("DB connection failed:", err);
  } else {
    console.log("Connected to HireWire database");
  }
});


/* -- API ROUTE STUFF -- */
// endpoint for job listings/employers (returns all job listing data)
app.get("/api/jobListings", (req, res) => {
    // console.log("API HIT: /api/jobListings"); // debug
  db.query('SELECT * FROM jobListings', (err, results) => { // sends sql query to database
    // console.log("QUERY CALLBACK REACHED"); // debug
    
    // error handling
    if (err) return res.status(50).json({ error: err.message });
        // console.error("SQL ERROR:", err); // debug
    
        // console.log("RESULTS:", results); // debug
    res.json(results); // send data to frontend by converting data to json
  });
});


//--------------------------------------------
// ── Single job by ID (for the swipe card) ──────────
app.get('/api/joblistings/:id', (req, res) => {
  db.query(
    'SELECT * FROM joblistings WHERE id = ?',
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ error: 'Not found' });
      res.json(results[0]);
    }
  );
});
//--------------------------------------------


// endpoint for job seekers/candidates (returns all candidate data)
app.get("/api/jobSeekers", (req, res) => { // tells the server to run this
  db.query('SELECT * FROM jobSeekers', (err, results) => { // sends sql query to database 
    // error handling
    if (err) return res.status(500).json({ error: err.message });

    res.json(results); // send data to frontend by converting data to json
  });
});



app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
