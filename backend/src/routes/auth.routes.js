const {cadastro , login} = require('../controllers/authController');
const {Router} = require('express');     //toda rota precisa de route

const router = Router();
router.post('/cadastro', cadastro); //associando a função cadastro com o caminho /cadastro
router.post('/login', login);       //associando a função login com o caminho /login

module.exports = router
