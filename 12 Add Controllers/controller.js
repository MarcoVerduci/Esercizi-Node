const express = require('express');
const app = express();
const planetController = require('./planetController');

app.use(express.json());

app.get('/api/planets', planetController.getPlanets);
app.get('/api/planets/:id', planetController.getPlanetById);
app.post('/api/planets', planetController.createPlanet);
app.put('/api/planets/:id', planetController.updatePlanet);
app.delete('/api/planets/:id', planetController.deletePlanet);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
