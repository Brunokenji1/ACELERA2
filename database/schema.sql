create table usuario(
	id SERIAL primary key,
	nome varchar(200) not null,
	idade interval not null, 
	email varchar(250) not null,
	senha nvarchar(255) not null,
	criado_em date 
);

create table vestibular(
	id serial primary key,
	nome varchar(200) not null
);

create table questao(
	id serial primary key,
	id_vestibular integer not null references vestibular(id)
);

create table materia (
	id serial primary key,
	nome varchar(200) unique not null
);
