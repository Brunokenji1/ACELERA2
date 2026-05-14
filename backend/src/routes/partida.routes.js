//todas as rotas devem ser protegidas com 'autenticar' pq só usuarios logados podem criar e entrar em partidas

const {criarPartida, entrarPartida, buscarPartida} = require('../controllers/partidaController')
const autenticar = require('../middlewares/authMiddleware');
const { Router } = require('express');

const router = Router();

router.post('/', autenticar, criarPartida);
router.post('/:id/entrar', autenticar, entrarPartida);
router.get('/:id', autenticar, buscarPartida);

module.exports = router;