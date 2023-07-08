const planets = [
    { id: 1, name: 'Mercury' },
    { id: 2, name: 'Venus' },
    { id: 3, name: 'Earth' },
];

exports.getAll = (req, res) => {
    res.json(planets);
};

exports.getOneById = (req, res) => {
    const planet = planets.find((p) => p.id === parseInt(req.params.id));
    if (!planet) {
        return res.status(404).json({ error: 'Planet not found' });
    }
    res.json(planet);
};

exports.create = (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const planet = {
        id: planets.length + 1,
        name,
    };
    planets.push(planet);

    res.status(201).json({ msg: 'Planet created successfully' });
};

exports.updateById = (req, res) => {
    const planetId = parseInt(req.params.id);
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const planetIndex = planets.findIndex((p) => p.id === planetId);
    if (planetIndex === -1) {
        return res.status(404).json({ error: 'Planet not found' });
    }

    planets[planetIndex] = { id: planetId, name };

    res.json({ msg: 'Planet updated successfully' });
};

exports.deleteById = (req, res) => {
    const planetId = parseInt(req.params.id);
    const planetIndex = planets.findIndex((p) => p.id === planetId);
    if (planetIndex === -1) {
        return res.status(404).json({ error: 'Planet not found' });
    }

    planets.splice(planetIndex, 1);

    res.json({ msg: 'Planet deleted successfully' });
};
