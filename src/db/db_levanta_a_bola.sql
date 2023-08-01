-- MySQL Script generated by MySQL Workbench
-- Wed Nov 30 09:48:21 2022
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

DROP DATABASE levanta_a_bola;

-- -----------------------------------------------------
-- Schema levanta_a_bola
-- -----------------------------------------------------
CREATE DATABASE levanta_a_bola;
USE levanta_a_bola;

-- -----------------------------------------------------
-- Table usuario
-- -----------------------------------------------------
CREATE TABLE usuario (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(45) NOT NULL UNIQUE,
  nome VARCHAR(55) NOT NULL,
  senha VARCHAR(45) NOT NULL,
  tipo TINYINT NOT NULL,
  dt_cadastro DATETIME NOT NULL DEFAULT now(),
  url_foto VARCHAR(200) NULL DEFAULT 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQJxKGGpPc9-5g25KWwnsCCy9O_dlS4HWo5A&usqp=CAU'
);


-- -----------------------------------------------------
-- Table proprietario
-- -----------------------------------------------------
CREATE TABLE proprietario (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);


-- -----------------------------------------------------
-- Table estado
-- -----------------------------------------------------
CREATE TABLE estado (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome CHAR(2) NOT NULL
);


-- -----------------------------------------------------
-- Table espaco_esportivo
-- -----------------------------------------------------
CREATE TABLE espaco_esportivo (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  url_documento VARCHAR(200) NOT NULL,
  situacao TINYINT NOT NULL,
  titulo VARCHAR(30) NOT NULL,
  cidade VARCHAR(30) NOT NULL,
  endereco VARCHAR(90) NOT NULL,
  tamanho VARCHAR(12) NOT NULL,
  url_foto VARCHAR(200) NULL DEFAULT 'https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg',
  descricao VARCHAR(150) NULL DEFAULT NULL,
  dt_aprovado DATETIME NULL DEFAULT NULL,
  estado_id INT UNSIGNED NOT NULL,
  proprietario_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (proprietario_id) REFERENCES proprietario(id),
  FOREIGN KEY (estado_id) REFERENCES estado(id)
);


-- -----------------------------------------------------
-- Table modalidade
-- -----------------------------------------------------
CREATE TABLE modalidade (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL
);


-- -----------------------------------------------------
-- Table evento
-- -----------------------------------------------------
CREATE TABLE evento (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `data` DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_final TIME NOT NULL,
  descricao VARCHAR(200) NOT NULL,
  situacao TINYINT NOT NULL DEFAULT 0,
  max_jogadores INT UNSIGNED NOT NULL,
  min_jogadores INT UNSIGNED NULL DEFAULT 0,
  data_limite DATE NULL,
  modalidade_id INT UNSIGNED NOT NULL,
  espaco_esportivo_id INT UNSIGNED NOT NULL,
  usuario_id_criador INT UNSIGNED NOT NULL,
  FOREIGN KEY (espaco_esportivo_id) REFERENCES espaco_esportivo(id),
  FOREIGN KEY (modalidade_id) REFERENCES modalidade(id),
  FOREIGN KEY (usuario_id_criador) REFERENCES usuario(id)
);


-- -----------------------------------------------------
-- Table evento_has_usuario
-- -----------------------------------------------------
CREATE TABLE evento_has_usuario (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  evento_id INT UNSIGNED NOT NULL,
  usuario_id INT UNSIGNED NOT NULL,
  situacao TINYINT NOT NULL DEFAULT 0,
  FOREIGN KEY (evento_id) REFERENCES evento(id),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);


-- -----------------------------------------------------
-- Table funcionamento
-- -----------------------------------------------------
CREATE TABLE funcionamento (
  espaco_esportivo_id INT UNSIGNED NOT NULL PRIMARY KEY,
  dom_hr_in TIME NULL,
  dom_hr_f TIME NULL,
  seg_hr_in TIME NULL,
  seg_hr_f TIME NULL,
  ter_hr_in TIME NULL,
  ter_hr_f TIME NULL,
  qua_hr_in TIME NULL,
  qua_hr_f TIME NULL,
  qui_hr_in TIME NULL,
  qui_hr_f TIME NULL,
  sex_hr_in TIME NULL,
  sex_hr_f TIME NULL,
  sab_hr_in TIME NULL,
  sab_hr_f TIME NULL,
  FOREIGN KEY (espaco_esportivo_id) REFERENCES espaco_esportivo(id)
);


-- -----------------------------------------------------
-- Table espaco_esportivo_has_modalidade
-- -----------------------------------------------------
CREATE TABLE espaco_esportivo_has_modalidade (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  espaco_esportivo_id INT UNSIGNED NOT NULL,
  modalidade_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (espaco_esportivo_id) REFERENCES espaco_esportivo(id),
  FOREIGN KEY (modalidade_id) REFERENCES modalidade(id)
);