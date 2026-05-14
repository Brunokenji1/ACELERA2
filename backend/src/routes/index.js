const { Router } = require('express');      //Router cria grupos de rotas 
const usuarioRotas = require('./usuario.routes');
const authRoutes = require('./auth.routes');
const questaoRouter = require('./questao.routes');
const partidaRouter = require('./partida.routes');

const router = Router();

router.get('/',( req, res)=>{       //pelo '/' nao possuir nada na frente, ele é equivalente a '/api'
    res.json({ mensagem: 'funcionando'});
});
router.use('/auth', authRoutes)     //aqui vai usar '/api/auth/cadastro'; '/api/auth/login'
router.use('/usuarios',usuarioRotas)
router.use('/questoes', questaoRouter)
router.use('/partidas', partidaRouter)

module.exports = router;
