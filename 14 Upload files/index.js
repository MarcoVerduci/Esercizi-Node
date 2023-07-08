const express = require('express');
const multer = require('multer');
const path = require('path');
const pgp = require('pg-promise')();

const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'your_database_name',
    user: 'your_username',
    password: 'your_password'
};

const db = pgp(dbConfig);

const app = express();
app.use(express.json());

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const upload = multer({ storage });

app.post('/api/planets/:id/image', upload.single('image'), async (req, res) => {
    const planetId = parseInt(req.params.id);
    const filePath = req.file.path;

    try {
        await db.none('UPDATE planets SET image = $1 WHERE id = $2', [filePath, planetId]);
        res.json({ msg: 'Image uploaded successfully' });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});