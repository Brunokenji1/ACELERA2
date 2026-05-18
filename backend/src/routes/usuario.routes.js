const {perfil, ranking, atualizarPerfil} = require('../controllers/usuarioController');
const autenticar = require('../middlewares/authMiddleware');
const {Router} = require('express');

const router = Router();

router.get('/perfil', autenticar, perfil);
router.get('/ranking', ranking);
router.get('/perfil', autenticar, atualizarPerfil);


module.exports = router