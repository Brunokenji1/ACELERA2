//aqui estao as funções que acontecem em tempo real, permitindo que os usuarios se comuniquem em tempo real com a partida
//socket.io mantem as requisiçõs abertas enquanto for necessario, sem necessidade de ficar abindo novas requisições que sao fechadas automaticamente depois de serem usadas

const { Server } = require('socket.io')
const {
    iniciarPartida,
    buscarRodadaAtual,
    registrarBuzz,
    processarResposta,
    encerrarPartida,
    avancarRodada
} = require('../services/partidaService')

function inicializarSocket(servidor){
    const io = new Server(servidor, {
        cors:{
            origin: process.env.FRONTEND_URL,
            methods: ['GET','POST']
        }
    })
    io.on('connection', (socket) =>{
        console.log(`Socket conectado: ${socket.id}`)

        //jogador entra na sala da partida
        socket.on('entrar_partida', async({ id_partida})=>{
            socket.join(`partida_${id_partida}`)
            console.log(`Socket ${socket.id} entrou na partida ${id_partida}`)
        })

        //inicia a partida - chamado quando os dois jogadores estiverem prontos
        socket.on('iniciar_partida', async ({ id_partida})=>{
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

        //jgador apertou o botao
        socket.on('buzz', async ({id_partida, id_usuario, tempo_buzz_ms})=>{
            try{
                const resultado = await registrarBuzz(id_partida, id_usuario, tempo_buzz_ms)
                if(resultado.erro){
                    socket.emit('erro', {mensagem: resultado.erro})
                    return
                }
                //avisa os jogadores que alguem apertou o botao
                io.to(`partida_${id_partida}`).emit('buzz_registrado', {
                    id_usuario,
                    ordem_tentativa: resultado.ordem_tentativa
                })
                //conta 5s para responder
                setTimeout(async()=>{
                    //se nao responder em 5s, passa a vez para o outro jogador
                    io.to(`partida_${id_partida}`).emit('tempo_resposta_esgotado', {id_usuario})
                }, 5000)
            }
            catch(err){
                socket.emit('erro', { mensagem: 'Erro ao registrar buzz'})
                console.log(err)
            }
        })

        //jogador escolher uma alternativa
        socket.on('responder', async({id_rodada, id_partida, id_usuario, id_alternativa, tempo_resposta_ms, tempo_buzz_ms})=>{
            try{
                const resultado = await processarResposta(id_rodada, id_partida, id_usuario, id_alternativa, tempo_resposta_ms, tempo_buzz_ms)

                if(resultado.erro){
                    socket.emit('erro', {mensagem: resultado.erro})
                    return
                }
                if(resultado.acertou){
                    io.to(`partida_${id_partida}`).emit('resposta_correta', {
                        id_usuario,
                        proxima_rodada: resultado.proxima_rodada
                    })
                    if(!resultado.proxima_rodada){
                        //significa que não tem mais rodadas
                        const final = await encerrarPartida(id_partida)
                        io.to(`partida_${id_partida}`).emit('partida_finalizada', final)
                        return
                    }

                    //aguarda 3 segundos pra liberar o buzz para a prox rodada
                    setTimeout(()=>{
                        io.to(`partida_${id_partida}`).emit('buzz_liberado')
                    }, 3000)

                } else if(resultado.outra_chance){
                    io.to(`partida_${id_partida}`).emit('resposta_errada', {
                        id_usuario,
                        outra_chance: true
                    })
                    //libera o buzz para outro jogador
                    setTimeout(() => {
                        io.to(`partida_${id_partida}`).emit('buzz_liberado')
                    }, 1000)

                } else{
                    io.to(`partida_${id_partida}`).emit('resposta_errada',{
                        id_usuario,
                        outra_chance: false,
                        proxima_rodada: resultado.proxima_rodada
                    })
                    if(!resultado.proxima_rodada){
                        const final = await encerrarPartida(id_partida)
                        io.to(`partida_${id_partida}`).emit('partida_finalizada', final)
                        return
                    }
                    setTimeout(() => {
                        io.to(`partida_${id_partida}`).emit('buzz_liberado')
                    }, 3000)
                }
            }
            catch(err){
                socket.emit('erro', {mensagem: 'Erro ao processar resposta'})
                console.log(err)
            }
        })

        //timer de 3minutos para cada questao
        socket.on('tempo_questao_esgotado', async({id_partida, id_rodada})=>{
            try{
                const proxima = await avancarRodada(id_partida)
                io.to(`partida_${id_partida}`).emit('questao_sem_resposta',{
                    proxima_rodada: proxima
                })
                if(!proxima){
                    const final = await encerrarPartida(id_partida)
                    io.to(`partida_${id_partida}`).emit('partida_finalizada', final)
                }
                setTimeout(() => {
                    io.to(`partida_${id_partida}`).emit('buzz_liberado')
                }, 3000)
            }
            catch(err){
                socket.emit('erro', {mensagem: 'Erro ao avançar rodada'})
                console.log(err)
            }
        })

        socket.on('disconnect',()=>{
            console.log(`Socket desconectado: ${socket.id}`)
        })
    })
    return io
}

module.exports = { inicializarSocket }