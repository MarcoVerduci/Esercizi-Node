const Joi = require('joi');

const Planet = {
    id: Joi.number().required(),
    name: Joi.string().required(),
};

let planets = [
    {
        id: 1,
        name: 'Earth',
    },
    {
        id: 2,
        name: 'Mars',
    },
];

function getPlanets(req, res) {
    res.json(planets);
}

function getPlanetById(req, res) {
    const planetId = parseInt(req.params.id);
    const planet = planets.find((p) => p.id === planetId);

    if (!planet) {
        return res.status(404).json({ error: 'Planet not found' });
    }

    res.json(planet);
}

function createPlanet(req, res) {
    const { error } = Planet.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const newPlanet = {
        id: req.body.id,
        name: req.body.name,
    };

    planets.push(newPlanet);
    res.status(201).json({ msg: 'Planet created successfully' });
}

function updatePlanet(req, res) {
    const planetId = parseInt(req.params.id);
    const planet = planets.find((p) => p.id === planetId);

    if (!planet) {
        return res.status(404).json({ error: 'Planet not found' });
    }

    const { error } = Planet.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    planet.name = req.body.name;
    res.json({ msg: 'Planet updated successfully' });
}

function deletePlanet(req, res) {
    const planetId = parseInt(req.params.id);
    const index = planets.findIndex((p) => p.id === planetId);

    if (index === -1) {
        return res.status(404).json({ error: 'Planet not found' });
    }

    planets.splice(index, 1);
    res.json({ msg: 'Planet deleted successfully' });
}

module.exports = {
    getPlanets,
    getPlanetById,
    createPlanet,
    updatePlanet,
    deletePlanet,
};
