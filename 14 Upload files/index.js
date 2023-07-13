const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const app = express();
const port = 3000;
const pgp = require('pg-promise')();
const connectionString = 'postgres://username:password@localhost:5432/planets_db';

const db = pgp(connectionString);

const createTableQuery = `
  DROP TABLE IF EXISTS planets;
  CREATE TABLE planets (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT
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

app.post('/planets/:id/image', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { path } = req.file;

  try {
    await db.none('UPDATE planets SET image=$2 WHERE id=$1', [id, path]);
    res.sendStatus(200);
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
