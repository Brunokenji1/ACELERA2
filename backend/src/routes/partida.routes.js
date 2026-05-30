//todas as rotas devem ser protegidas com 'autenticar' pq só usuarios logados podem criar e entrar em partidas

const {criarPartida, entrarPartida, buscarPartida, iniciar, buzz, responder} = require('../controllers/partidaController')
const {criarPartidaValidator} = require('../validators/partidaValidator');
const autenticar = require('../middlewares/authMiddleware');
const { Router } = require('express');

const router = Router();

router.post('/', autenticar,criarPartidaValidator, criarPartida);
router.post('/:id/entrar', entrarPartida);
router.get('/:id', autenticar, buscarPartida);
router.post('/:id/iniciar/', autenticar, iniciar);
router.post('/:id/buzz', buzz); //autenticado no frontend
router.post('/:id/responder', responder);

module.exports = router;