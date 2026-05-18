const {listarMaterias, listarQuestoes, buscarQuestoes, responderQuestao} = require('../controllers/questaoController');
const autenticar = require('../middlewares/authMiddleware');
const {Router} = require('express');

const router = Router();

router.get('/materias', listarMaterias);
router.get('/', listarQuestoes);
router.get('/:id', buscarQuestoes);
router.post('/:id/responder', autenticar, responderQuestao);

module.exports = router
