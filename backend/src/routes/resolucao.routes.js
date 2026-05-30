const { listarResolucoes } = require('../controllers/resolucaoController');
const autenticar = require('../middlewares/authMiddleware');
const {Router} = require('express');

const router = Router();

router.get('/', autenticar, listarResolucoes);

module.exports = router;