const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
app.use(express.json());

const dbPath = process.env.NODE_ENV === 'development' ? path.join(__dirname, 'database.db') : path.resolve(process.resourcesPath, 'database.db'); // chooses where to store db based on running env
console.log('database path:', dbPath)
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the database.');
    // Create the table if it doesn't exist

    db.run('CREATE TABLE IF NOT EXISTS counter (value INTEGER)');
  }
});


// Function to get the current counter value
function getCounterValue(callback) {
  db.get('SELECT value FROM counter', (err, row) => {
    if (err) {
      console.error('Error retrieving counter value:', err.message);
      callback(0);
    } else {
      if (typeof row === 'undefined') {
        db.run(`INSERT INTO counter(value) VALUES(?)`, [0], function (err) {
          if (err) {
            return console.log(err.message);
          }
          // get the last insert id
          console.log(`A row has been inserted with rowid ${this.lastID}`);
          callback(0);
        });
      }
      else {
        callback(row ? row.value : 0);
      }
    }
  });
}

// Function to increment the counter
function incrementCounter() {
  getCounterValue((currentValue) => {
    let newValue = currentValue + 1;
    db.run('UPDATE counter SET value = ? WHERE value = ?', [newValue, currentValue], (err) => {
      if (err) {
        console.error('Error updating counter value:', err.message);
      } else {
        console.log('Counter incremented:', newValue);
      }
    });
  });
}

// Server-side rendering function (Replace this with your actual rendering logic)
function renderhtml(counter) {
  // Replace this with your actual HTML template and rendering logic
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Poop tracker</title>
    </head>
    <body>
      <em>This app is also available at localhost:3000/</em>
      <p>db path is: ${dbPath}</p>
      <h1>Poop tracker</h1>
      <ul>${counter}</ul>
      <a href='/increment'><button>I pooped</button></a>
    </body>
    </html>
  `;
}

//routes

// Parse JSON request bodies

app.get('/increment', (req, res) => {
  incrementCounter()
  res.redirect('/')
})

// Server-side rendering route
app.get('/', (req, res) => {
  // Fetch counter from the database
  getCounterValue(counter => {
    // send counter value to renderer
    const html = renderhtml(counter);
    // Send the pre-rendered HTML to the client
    res.send(html);
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
