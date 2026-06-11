const { listarResolucoes, buscarResolucao } = require('../controllers/resolucaoController');
const autenticar = require('../middlewares/authMiddleware');
const {Router} = require('express');

const router = Router();

router.get('/', autenticar, listarResolucoes);
router.get('/:id', autenticar, buscarResolucao);

module.exports = router;