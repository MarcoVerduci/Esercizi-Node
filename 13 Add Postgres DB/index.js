exports.getAll = async (req, res) => {
    try {
        const planets = await db.any('SELECT * FROM planets');
        res.json(planets);
    } catch (error) {
        console.error('Error retrieving planets:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getOneById = async (req, res) => {
    const planetId = parseInt(req.params.id);
    try {
        const planet = await db.one('SELECT * FROM planets WHERE id = $1', planetId);
        res.json(planet);
    } catch (error) {
        console.error('Error retrieving planet:', error);
        res.status(404).json({ error: 'Planet not found' });
    }
};

exports.create = async (req, res) => {
    const { name } = req.body;
    try {
        const result = await db.none('INSERT INTO planets (name) VALUES ($1)', name);
        res.status(201).json({ msg: 'Planet created successfully' });
    } catch (error) {
        console.error('Error creating planet:', error);
        res.status(400).json({ error: 'Failed to create planet' });
    }
};

exports.updateById = async (req, res) => {
    const planetId = parseInt(req.params.id);
    const { name } = req.body;
    try {
        const result = await db.none('UPDATE planets SET name = $1 WHERE id = $2', [name, planetId]);
        res.json({ msg: 'Planet updated successfully' });
    } catch (error) {
        console.error('Error updating planet:', error);
        res.status(400).json({ error: 'Failed to update planet' });
    }
};

exports.deleteById = async (req, res) => {
    const planetId = parseInt(req.params.id);
    try {
        const result = await db.result('DELETE FROM planets WHERE id = $1', planetId);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Planet not found' });
        }
        res.json({ msg: 'Planet deleted successfully' });
    } catch (error) {
        console.error('Error deleting planet:', error);
        res.status(400).json({ error: 'Failed to delete planet' });
    }
};
