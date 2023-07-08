const express = require('express');
const Joi = require('joi');

const planets = [
  { id: 1, name: 'Mercury' },
  { id: 2, name: 'Venus' },
  { id: 3, name: 'Earth' },
];

const app = express();
app.use(express.json());

app.get('/api/planets', (req, res) => {
  res.json(planets);
});

app.get('/api/planets/:id', (req, res) => {
  const planet = planets.find(p => p.id === parseInt(req.params.id));
  if (!planet) {
    return res.status(404).json({ error: 'Planet not found' });
  }
  res.json(planet);
});

app.post('/api/planets', (req, res) => {
  const { error } = validatePlanet(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const planet = {
    id: planets.length + 1,
    name: req.body.name
  };
  planets.push(planet);

  res.status(201).json({ msg: 'Planet created successfully' });
});

app.put('/api/planets/:id', (req, res) => {
  const planet = planets.find(p => p.id === parseInt(req.params.id));
  if (!planet) {
    return res.status(404).json({ error: 'Planet not found' });
  }

  const { error } = validatePlanet(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  planet.name = req.body.name;
  res.json({ msg: 'Planet updated successfully' });
});

app.delete('/api/planets/:id', (req, res) => {
  const index = planets.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Planet not found' });
  }

  planets.splice(index, 1);
  res.json({ msg: 'Planet deleted successfully' });
});

const planetSchema = Joi.object({
  name: Joi.string().required()
});

function validatePlanet(planet) {
  return planetSchema.validate(planet);
}

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
