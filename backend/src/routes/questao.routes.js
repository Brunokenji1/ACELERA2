const {listarMaterias, listarQuestoes, buscarQuestoes} = require('../controllers/questaoController');
const {Router} = require('express');

const router = Router();

router.get('/materias', listarMaterias);
router.get('/:id', buscarQuestoes);
router.get('/', listarQuestoes);

module.exports = router
