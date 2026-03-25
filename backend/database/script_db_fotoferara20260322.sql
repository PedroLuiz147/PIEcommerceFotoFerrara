CREATE DATABASE db_fotoferrara;
SET FOREIGN_KEY_CHECKS = 0;

USE db_fotoferrara;

CREATE TABLE endereco(
id_endereco INT not null auto_increment PRIMARY KEY,
cep char(8) not null,
rua varchar (150) not null,
numero_endereco varchar (10) not null,
bairro varchar (100) not null,
cidade varchar (100) not null, 
estado char (2) not null,
complemento varchar (100) null
);

select * from db_fotoferrara.endereco;

CREATE TABLE funcionario(
id_funcionario int not null auto_increment PRIMARY KEY,
nome_funcionario varchar(100) not null,
cargo_funcionario varchar(50)
);

select * from db_fotoferrara.funcionario;

CREATE TABLE categoria_produto(
id_categoria_prod INT not null auto_increment PRIMARY KEY,
nome_categoria_prod varchar(100) not null unique,
descricao_categoria_prod varchar(250)
);

select * from db_fotoferrara.categoria_produto;

CREATE TABLE cliente(
id_cliente int not null auto_increment PRIMARY KEY,
nome_cliente varchar(100) not null,
email_cliente varchar(150) not null unique,
telefone_cliente varchar (20),
tipo_cliente enum('F', 'J'),
data_cadastro_cliente date not null
);

select * from db_fotoferrara.cliente;

CREATE TABLE pessoa_fisica(
id_cliente int not null PRIMARY KEY,
cpf char(11) not null unique,
foreign key (id_cliente) references cliente (id_cliente)
);

select * from db_fotoferrara.pessoa_fisica;

drop table pessoa_fisica;

CREATE TABLE pessoa_fisica(
id_cliente int not null PRIMARY KEY,
cpf char(11) not null unique,
constraint fk_pf_cliente
foreign key (id_cliente) references cliente (id_cliente)
);

CREATE TABLE pessoa_juridica(
id_cliente int not null PRIMARY KEY,
cnpj char(14) not null unique,
constraint fk_pj_cliente
foreign key (id_cliente) references cliente (id_cliente)
);

select * from db_fotoferrara.pessoa_juridica;

CREATE TABLE cliente_endereco(
id_cliente int not null,
id_endereco int not null,
PRIMARY KEY (id_cliente, id_endereco),

constraint fk_cliente
foreign key (id_cliente) references cliente(id_cliente)
on delete cascade,
constraint fk_endereco
foreign key (id_endereco) references endereco(id_endereco)
on delete cascade
);

CREATE TABLE produto(
id_produto int not null auto_increment PRIMARY KEY,
nome_produto varchar (100) not null,
descricao_produto TEXT,
preco_produto decimal (10,2) not null,

id_funcionario int,
id_categoria_prod int,

constraint fk_funcionario
foreign key (id_funcionario) references funcionario(id_funcionario),
constraint fk_categoria
foreign key (id_categoria_prod) references categoria_produto(id_categoria_prod)
);

select * from db_fotoferrara.produto;

CREATE TABLE imagem_produto(
id_imagem int not null auto_increment PRIMARY KEY,
url varchar(500) not null,
ordem int,
id_produto int not null,

constraint fk_produto
foreign key (id_produto) references produto (id_produto)
on delete cascade
);

select * from db_fotoferrara.imagem_produto;

CREATE TABLE estoque(
id_produto int not null PRIMARY KEY,
quantidade int not null,

constraint fk_produto_estoque
foreign key (id_produto) references produto (id_produto)
on delete cascade
);

select * from db_fotoferrara.estoque;

CREATE TABLE pedido(
id_pedido int not null auto_increment PRIMARY KEY,
data_pedido datetime not null default current_timestamp,
valor_total decimal (10,2) not null,
id_cliente int not null,
id_funcionario int,

constraint fk_pedido_cliente
foreign key (id_cliente) references cliente (id_cliente),
constraint fk_pedido_funcionario
foreign key (id_funcionario) references funcionario (id_funcionario)
);

select*from db_fotoferrara.pedido;

CREATE TABLE item_pedido(
id_pedido int not null,
id_produto int not null,
quantidade int not null,
preco_unitario decimal (10,2) not null,
observacao text,

PRIMARY KEY (id_pedido, id_produto),

constraint fk_pedido_item
foreign key (id_pedido) references pedido (id_pedido)
on delete cascade,
constraint fk_produto_item
foreign key (id_produto) references produto (id_produto),

check (quantidade >0)
);

select*from db_fotoferrara.item_pedido;

CREATE TABLE status_pedido(
id_status int not null auto_increment primary key,
descricao varchar (50) not null,
data_alteracao datetime not null default current_timestamp,
id_pedido int not null,

constraint fk_pedido
foreign key (id_pedido) references pedido (id_pedido)
on delete cascade
);

select*from db_fotoferrara.status_pedido;

ALTER TABLE pedido DROP FOREIGN KEY fk_pedido_cliente;
ALTER TABLE pedido DROP FOREIGN KEY fk_pedido_funcionario;

ALTER TABLE pedido 
ADD CONSTRAINT fk_pedido_cliente 
FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente) 
ON DELETE RESTRICT;

ALTER TABLE pedido 
ADD CONSTRAINT fk_pedido_funcionario 
FOREIGN KEY (id_funcionario) REFERENCES funcionario (id_funcionario) 
ON DELETE RESTRICT;

select*from db_fotoferrara.pedido;

show tables;

SET FOREIGN_KEY_CHECKS = 1;