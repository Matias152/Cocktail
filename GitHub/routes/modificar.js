const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// Configurar el puerto
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para servir la página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Ruta para consumir la API de TheCocktailDB
app.post('/api', async (req, res) => {
  const { cocktailName } = req.body;

  if (!cocktailName) {
    return res.status(400).json({ error: 'El nombre del cóctel es requerido.' });
  }

  try {
    // URL de la API de TheCocktailDB
    const apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`;
    const response = await axios.get(apiUrl);

    // Comprobamos si encontramos algún cóctel
    if (response.data.drinks) {
      res.json(response.data.drinks);
    } else {
      res.status(404).json({ error: 'No se encontraron cócteles con ese nombre.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error al procesar la solicitud.' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
