const {perfil, ranking, atualizarPerfil, atualizarFoto} = require('../controllers/usuarioController');
const autenticar = require('../middlewares/authMiddleware');
const uploadFoto = require('../config/upload');
const {Router} = require('express');

const router = Router();

router.get('/perfil', autenticar, perfil);
router.get('/ranking', ranking);
router.put('/perfil', autenticar, atualizarPerfil);
router.put('/perfil/foto', autenticar, uploadFoto.single('foto'), atualizarFoto);

module.exports = router