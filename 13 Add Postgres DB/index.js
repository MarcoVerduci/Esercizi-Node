const express = require('express');
const app = express();
const port = 3000;
const pgp = require('pg-promise')();
const connectionString = 'postgres://username:password@localhost:5432/planets_db';

const db = pgp(connectionString);

const createTableQuery = `
  DROP TABLE IF EXISTS planets;
  CREATE TABLE planets (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL
  );
`;

async function setupDb() {
  try {
    await db.none(createTableQuery);
    console.log('Database setup complete.');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

app.use(express.json());

app.get('/planets', async (req, res) => {
  try {
    const planets = await db.any('SELECT * FROM planets');
    res.json(planets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/planets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const planet = await db.one('SELECT * FROM planets WHERE id = $1', [id]);
    res.json(planet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/planets', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await db.none('INSERT INTO planets (name) VALUES ($1)', [name]);
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/planets/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await db.none('UPDATE planets SET name = $2 WHERE id = $1', [id, name]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/planets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.result('DELETE FROM planets WHERE id = $1', [id]);
    if (result.rowCount === 1) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

setupDb().then(() => {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
});
