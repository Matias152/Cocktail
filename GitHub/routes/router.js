import { Router } from 'express';
import { join } from 'path';
var router = Router();

/* GET home page. */
router.get('/', function(_req, res) {
  res.sendFile(join(__dirname + '/../views/index.html'));
});

// Ruta de página de información.
router.get('/about', function(_req, res) {
  res.sendFile(join(__dirname + '/../views/about.html'));
})

// show bebida
router.get('/bebida/:id', function(_req, res) {
  res.sendFile(join(__dirname + '/../views/bebida.html'));
});

// Ruta para obtener el menú (resources.js).
router.get('/resources/menu', function(_req, res) {
  res.sendFile(join(__dirname + '/../public/resources/menu.html'));
});

// Ruta para obtener el footer (resources.js).
router.get('/resources/footer', function(_req, res) {
  res.sendFile(join(__dirname + '/../public/resources/footer.html'));
});

export default router;