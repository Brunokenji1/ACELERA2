const {cadastro , login} = require('../controllers/authController');
const {Router} = require('express');     //toda rota precisa de route
const { cadastroValidator, loginValidator} = require('../validators/authValidator');

const router = Router();
router.post('/cadastro', cadastroValidator , cadastro);  //associando a função cadastro com o caminho /cadastro
router.post('/login', loginValidator , login);           //validator fica entre a rota e o controller, ele roda primeiro e valida os dados.


module.exports = router
