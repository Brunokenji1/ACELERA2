//aqui estao as funções que acontecem em tempo real, permitindo que os usuarios se comuniquem em tempo real com a partida
//socket.io mantem as requisiçõs abertas enquanto for necessario, sem necessidade de ficar abindo novas requisições que sao fechadas automaticamente depois de serem usadas

const { Server } = require('socket.io')
const {
    iniciarPartida,
    buscarRodadaAtual,
    registrarBuzz,
    processarResposta,
    encerrarPartida
} = require('../services/partidaService')

function inicializarSocket(servidor){
    const io = new Server(servidor, {
        cors:{
            origin: process.env.FRONTEND_URL,
            methods: ['GET','POST']
        }
    })
    io.on('connection', (socket) =>{
        console.log(`Socket conectado: ${socket.io}`)

        //jogador entra na sala da partida
        socket.io('entrar_partida', async({ id_partida})=>{
            socket.join(`partida_${id_partida}`)
            console.log(`Socket ${socket.id} entrou na partida ${id_partida}`)
        })
        //inicia a partida - chamado quando os dois jogadores estiverem prontos
        socket.in('iniciar_partida', async ({ id_partida})=>{
            try{
                const resultado = await iniciarPartida(id_partida)
                if(resultado.erro){
                    socket.emit('erro', {message: resultado.erro})
                    return
                }
                const rodadaAtual = await buscarRodadaAtual(id_partida)

                //avisa todos na sala que a partida começou
                io.to(`partida_${id_partida}`).emit('partida_iniciada',{
                    rodada: rodadaAtual,
                })

                //inicia timer de 5s antes de liberar os botoes
                setTimeout(()=>{
                    io.to(`partida_${id_partida}`).emit('buzz_liberado')
                }, 5000)
            }
            catch(err){
                socket.emit('erro', {mensagem: 'Erro ao iniciar partida'})
                console.log(err)
            }
        })

        //jgoador apertou o botao
        socket.io('buzz', async ({id_partida, id_usuario, tempo_buzz_ms})=>{
            try{
                const resultado = await registrarBuzz(id_partida, id_usuario,)
            }
            catch(err){}
            socket.emit('erro', { mensagem: 'Erro ao registrar buzz'})
            console.log(err)
        })

    })


}
