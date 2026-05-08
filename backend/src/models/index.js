// aqui devo importar todos os models e definir a relação entre eles

//hasMany = "tem muitos" --> Partidas.hasMany(Rodadas, {foreignKey: 'id_partida'})
//belongsTo = "pertence a" --> Rodadas.belongsTo(Partidas, {foreignKey: 'id_partida'})
// se "A hasMany B", devo colocar tbm "B belongsTo A"

const Alternativas = require('./Alternativas');
const Fontes = require('./Fontes');
const Materias = require('./Materias');
const Partidas = require('./Partidas');
const Questoes = require('./Questoes');
const RodadaDeQuestoes = require('./RodadaDeQuestoes');
const Rodadas = require('./Rodadas');
const Tentativas = require('./Tentativas');
const TipoNivel = require('./TipoNivel');
const Usuarios = require('./Usuarios');
const UsuarioPartida= require('./UsuarioPartida');

// relações, de 2 em 2 (tem / está incluso)
TipoNivel.hasMany(Fontes,{
    foreignKey: 'id_tipo_nivel',
});
Fontes.belongsTo(TipoNivel,{
    foreignKey: 'id_tipo_nivel'
});
//-------------------------------------------------------
Fontes.hasMany(Questoes,{
    foreignKey: 'id_fonte'
});
Questoes.belongsTo(Fontes,{
    foreignKey: 'id_fonte'
});
//-------------------------------------------------------
Materias.hasMany(Questoes,{
    foreignKey: 'id_materia'
});
Questoes.belongsTo(Materias,{
    foreignKey: 'id_materia'
});
//-------------------------------------------------------
Questoes.hasMany(Alternativas,{
    foreignKey: 'id_questao'
});
Alternativas.belongsTo(Questoes,{
    foreignKey: 'id_questao'
});
//-------------------------------------------------------
Usuarios.hasMany(Partidas,{
    foreignKey: 'id_criador'
});
Partidas.belongsTo(Usuarios,{
    foreignKey: 'id_criador'
});
//-------------------------------------------------------
Materias.hasMany(Partidas,{
    foreignKey: 'id_materia',
});
Partidas.belongsTo(Materias,{
    foreignKey: 'id_materia',
});
//-------------------------------------------------------
Fontes.hasMany(Partidas,{
    foreignKey: 'id_fonte',
});
Partidas.belongsTo(Fontes,{
    foreignKey: 'id_fonte',
});
//-------------------------------------------------------
Usuarios.hasMany(UsuarioPartida,{
    foreignKey: 'id_usuario'
});
UsuarioPartida.belongsTo(Usuarios,{
    foreignKey: 'id_usuario'
});
//-------------------------------------------------------
Partidas.hasMany(UsuarioPartida,{
    foreignKey: 'id_partida',
    onDelete: 'CASCADE'
});
UsuarioPartida.belongsTo(Partidas,{
    foreignKey: 'id_partida'
});
//-------------------------------------------------------
Partidas.hasMany(Rodadas,{
    foreignKey: 'id_partida',
    onDelete: 'CASCADE'
});
Rodadas.belongsTo(Partidas,{
    foreignKey: 'id_partida'
})
//-------------------------------------------------------
Rodadas.hasMany(RodadaDeQuestoes,{
    foreignKey: 'id_rodada',
    onDelete: 'CASCADE'
});
RodadaDeQuestoes.belongsTo(Rodadas,{
    foreignKey: 'id_rodada'
});
//-------------------------------------------------------
Questoes.hasMany(RodadaDeQuestoes,{
    foreignKey: 'id_questao'
});
RodadaDeQuestoes.belongsTo(Questoes,{
    foreignKey: 'id_questao'
});
//-------------------------------------------------------
Usuarios.hasMany(RodadaDeQuestoes,{
    foreignKey: 'id_participante_1'
});
RodadaDeQuestoes.belongsTo(Usuarios,{
    foreignKey: 'id_participante_1'
});
//-------------------------------------------------------
Usuarios.hasMany(RodadaDeQuestoes,{
    foreignKey: 'id_participante_2'
});
RodadaDeQuestoes.belongsTo(Usuarios,{
    foreignKey: 'id_participante_2'
});
//-------------------------------------------------------
Alternativas.hasMany(Tentativas,{
    foreignKey: 'id_alternativa'
});
Tentativas.belongsTo(Alternativas,{
    foreignKey: 'id_alternativa'
});
//-------------------------------------------------------
Rodadas.hasMany(Tentativas,{
    foreignKey: 'id_rodada',
    onDelete: 'CASCADE'
});
Tentativas.belongsTo(Rodadas,{
    foreignKey: 'id_rodada'
});
//-------------------------------------------------------
Usuarios.hasMany(Tentativas,{
    foreignKey: 'id_usuario'
});
Tentativas.belongsTo(Usuarios,{
    foreignKey: 'id_usuario'
});

module.exports ={
    Alternativas,Fontes,Materias,Partidas,Questoes, 
    RodadaDeQuestoes, Rodadas, Tentativas, TipoNivel, 
    UsuarioPartida, Usuarios
}