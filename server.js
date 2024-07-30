const express = require('express');
const mysql = require('mysql2'); // Import the mysql package
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:4200', // Allow only this origin
  methods: 'GET,POST,PUT,DELETE',  // Allow these methods
  allowedHeaders: 'Content-Type,Authorization' // Allow these headers
}));

// Middleware to parse JSON data
app.use(bodyParser.json());

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootguru',
  database: 'boxdb', // Specify your database name here
  port: 3306
});

// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Create a table to store the box data if it doesn't exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS boxes (
    id INT  PRIMARY KEY,
    title VARCHAR(255),
    size INT
  )
`;
db.query(createTableQuery, (err, _result) => {
  if (err) {
    throw err;
  }
  console.log('Table created or already exists');
});


async function getNextId() {
  const [rows] = await db.promise().query('SELECT MAX(id) AS maxId FROM boxes');
  const maxId = rows[0].maxId;
  return maxId ? maxId + 1 : 1; // If no boxes exist, start with ID 1
}

// API to get all boxes
app.get('/boxes', (req, res) => {
  db.query('SELECT * FROM boxes ORDER BY id', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// API to get a single box by ID
app.get('/boxes/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM boxes WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Box not found' });
      return;
    }
    res.json(results[0]);
  });
});

// API to create a new box
app.post('/boxes', async (req, res) => {
  const { title, size } = req.body;
  try {
    const nextId = await getNextId();
    db.query('INSERT INTO boxes (id, title, size) VALUES (?, ?, ?)', [nextId, title, size], (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: nextId, title, size });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to update a box by ID
app.put('/boxes/:id', (req, res) => {
  const { id } = req.params;
  const { title, size } = req.body;
  db.query('UPDATE boxes SET title = ?, size = ? WHERE id = ?', [title, size, id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Box not found' });
      return;
    }
    res.json({ id, title, size });
  });
});

// API to delete a box by ID and reassign IDs
app.delete('/boxes/:id', (req, res) => {
  const { id } = req.params;

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Step 1: Delete the box
    db.query('DELETE FROM boxes WHERE id = ?', [id], (err, results) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: err.message });
        });
      }
      if (results.affectedRows === 0) {
        return db.rollback(() => {
          res.status(404).json({ error: 'Box not found' });
        });
      }

      // Step 2: Reassign IDs for remaining boxes
      db.query('SELECT id FROM boxes ORDER BY id', (err, boxes) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        const queries = boxes.map((box, index) => {
          return new Promise((resolve, reject) => {
            db.query('UPDATE boxes SET id = ? WHERE id = ?', [index + 1, box.id], (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
        });

        // Execute all the ID reassignment queries
        Promise.all(queries)
          .then(() => {
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ error: err.message });
                });
              }
              res.status(204).send();
            });
          })
          .catch((error) => {
            db.rollback(() => {
              res.status(500).json({ error: error.message });
            });
          });
      });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


