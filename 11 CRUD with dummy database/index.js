const express = require('express');
const Joi = require('joi');

const app = express();
app.use(express.json());

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

const planetSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
});

app.get('/api/planets', (req, res) => {
  res.json(planets);
});

app.get('/api/planets/:id', (req, res) => {
  const planetId = parseInt(req.params.id);
  const planet = planets.find((p) => p.id === planetId);

  if (!planet) {
    return res.status(404).json({ error: 'Planet not found' });
  }

  res.json(planet);
});

app.post('/api/planets', (req, res) => {
  const { error } = planetSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const newPlanet = {
    id: req.body.id,
    name: req.body.name,
  };

  planets.push(newPlanet);
  res.status(201).json({ msg: 'Planet created successfully' });
});

app.put('/api/planets/:id', (req, res) => {
  const planetId = parseInt(req.params.id);
  const planet = planets.find((p) => p.id === planetId);

  if (!planet) {
    return res.status(404).json({ error: 'Planet not found' });
  }

  const { error } = planetSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  planet.name = req.body.name;
  res.json({ msg: 'Planet updated successfully' });
});

app.delete('/api/planets/:id', (req, res) => {
  const planetId = parseInt(req.params.id);
  const index = planets.findIndex((p) => p.id === planetId);

  if (index === -1) {
    return res.status(404).json({ error: 'Planet not found' });
  }

  planets.splice(index, 1);
  res.json({ msg: 'Planet deleted successfully' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
