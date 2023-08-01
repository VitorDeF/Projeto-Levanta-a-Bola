/*
USUARIO
id(null), email, nome, senha, tipo(0 = jogador; 1 = proprietario), foto(null)
*/
insert into usuario values 
(null, 'abacaxi@gmail.com', 'Vitor Nunes', '5678', 1, default, null), -- 1*
(null, 'julio@gmail.com', 'Júlio Moraes', '123', 0, default, null), -- 2
(null, 'luiza@gmail.com', 'Luiza Pereira', '123', 0, default, null), -- 3
(null, 'andre@gmail.com', 'Andre Gomes', '123', 0, default, null), -- 4
(null, 'maria@gmail.com', 'Maria Clara', '123', 0, default, null), -- 5
(null, 'marcelo@gmail.com', 'Marcelo Couto', '1234', 1, default, null), -- 6*
(null, 'anderson@gmail.com', 'Anderson Lima', '4321', 1, default, null), -- 7*
(null, 'jorge@gmail.com', 'Jorge Silva', '123', 0, default, null), -- 8
(null, 'gabriel@gmail.com', 'Gabriel Araújo', '123', 0, default, null), -- 9
(null, 'jose@gmail.com', 'José Costa', 'aaa', 0, default, null); -- 10

/*
PROPRIETARIO
id(null), usuario_id(FK)
*/
insert into proprietario values 
(null, 1),-- 1
(null, 6),-- 2
(null, 7);-- 3

/*
ESTADO
id, nome(2 caracteres)
*/
insert into estado values 
(null, 'AC'),-- 1
(null, 'AL'),-- 2
(null, 'AP'),-- 3
(null, 'AM'),-- 4
(null, 'BA'),-- 5
(null, 'CE'),-- 6
(null, 'DF'),-- 7
(null, 'ES'),-- 8
(null, 'GO'),-- 9
(null, 'MA'),-- 10
(null, 'MT'),-- 11
(null, 'MS'),-- 12
(null, 'MG'),-- 13
(null, 'PA'),-- 14
(null, 'PB'),-- 15
(null, 'PR'),-- 16
(null, 'PE'),-- 17
(null, 'PI'),-- 18
(null, 'RJ'),-- 19
(null, 'RN'),-- 20
(null, 'RS'),-- 21
(null, 'RO'),-- 22
(null, 'RR'),-- 23
(null, 'SC'),-- 24
(null, 'SP'),-- 25
(null, 'SE'),-- 26
(null, 'TO');-- 27

/*
ESPACO_ESPORTIVO
id, url_documento, situacao(0 = pendente; 1 = pode mostrar no site), titulo, cidade, endereco, 
tamanho, foto(null), descricao(null), dt_aprovado, estado_id(FK), proprietario_id(FK)
*/
insert into espaco_esportivo values
(null, 'url do documento', 0, 'Quadra legal', 'Belo Horizonte', 'Rua Bernardo Guimarães, 20 - Savassi', '2x5', default, 'Uma quadra em Belo Horizonte', null, 13, 1),-- 1
(null, 'url do documento', 0, 'Quadra bem legal', 'Contagem', 'Avenida Boa Demais, 137 - Industrial', '12x5', default, 'Uma quadra lá em Contagem', null, 25, 2),-- 2
(null, 'url do documento', 0, 'Quadra bem mais legal',  'Belo Horizonte', 'Rua São Fidelis, 939 - Nova Vista', '20x50', default, 'Uma quadra outra quadra em BH', null, 6, 3);-- 3

/*
MODALIDADE
id, nome
*/
insert into modalidade values 
(null, 'Futebol'),-- 1
(null, 'Futsal'),-- 2
(null, 'Basquete'),-- 3
(null, 'Vôlei'),-- 4
(null, 'Tênis'),-- 5
(null, 'Atletismo'),-- 6
(null, 'Jogos de salão'),-- 7
(null, 'Handebol'),-- 8
(null, 'Rugby'),-- 9
(null, 'Golfe'),-- 10
(null, 'Basebol'),-- 11
(null, 'Natação');-- 12

/*
ESPACO_ESPORTIVO_HAS_MODALIDADE
espaco_esportivo_id(FK), modalidade_id(FK)

Define quais modalidades estarão disponíveis em um espaço esportivo
*/
insert into espaco_esportivo_has_modalidade values 
(null,1,1),
(null,2,1),
(null,2,2),
(null,2,3),
(null,2,8),
(null,3,4),
(null,3,5),
(null,3,7),
(null,3,10),
(null,3,12);

/*
EVENTO
id, data(yyyy-mm-dd), hora_inicio, hora_final, descricao, situacao(0 = proprietario não liberou; 1 = proprietario liberou), 
max_jogadores, min_jogadores, data_limite, modalidade_id, espaco_esportivo_id, usuario_id_criador
*/
insert into evento values 
(null, '2022-12-25', '14:00', '15:00', 'Partida de futebol casual para fazer amigos.', 0, 12, 6, '2022-12-20', 1, 2, 2),-- 1
(null, '2022-12-20', '18:00', '19:00', 'Partida de basquete casual para fazer amigos.', 0, 8, 2, '2022-12-15', 3, 2, 4),-- 2*
(null, '2022-12-25', '10:00', '11:00', 'Partida de vôlei casual para fazer amigos.', 0, 6, 4, '2022-12-20', 4, 3, 8),-- 3
(null, '2022-12-18', '14:30', '15:30', 'Partida de tênis casual para fazer amigos.', 0, 4, 2, '2022-12-13', 5, 3, 9),-- 4
(null, '2022-12-10', '16:00', '18:00', 'Partida de golfe casual para fazer amigos.', 1, 5, 2, '2022-12-05', 10, 3, 10),-- 5*
(null, '2022-12-10', '16:00', '18:00', 'Partida de futsal casual para fazer amigos.', 1, 5, 2, '2022-12-05', 2, 3, 2);-- 6* 
(null, '2022-10-10', '16:00', '18:00', 'Partida de golfe. Só pra quem manja', 1, 5, 2, '2022-10-05', 12, 3, 10),-- 7*                      ADICIONADO 15/12
(null, '2022-11-20', '18:00', '19:00', 'Partida de basquete amador. Todos são bem vindos', 0, 8, 2, '2022-11-15', 12, 2, 4),-- 8*                      ADICIONADO 15/12


/*
EVENTO_HAS_USUARIO
evento_id(FK), usuario_id(FK), situacao(0 = criador do evento ainda não aceitou o usuario; 1 = usuario aceito pelo criador do evento)
*/
insert into evento_has_usuario values 
(null, 2, 4, 1),
(null, 2, 2, 1),
(null, 2, 3, 1),
(null, 2, 5, 1),
(null, 2, 8, 1),
(null, 2, 9, 0),
(null, 2, 10, 0),
(null, 5, 10, 1),
(null, 5, 9, 0),
(null, 5, 2, 0);

/*
FUNCIONAMENTO
espaco_esportivo_id(FK), 
dom_hr_in, dom_hr_f, 
seg_hr_in, seg_hr_f, 
ter_hr_in, ter_hr_f, 
qua_hr_in, qua_hr_f, 
qui_hr_in, qui_hr_f, 
sex_hr_in, sex_hr_f, 
sab_hr_in, sab_hr_f
*/
insert into funcionamento values 
(2, '14:00', '19:00',
'10:00', '19:00',
'10:00', '19:00',
'10:00', '19:00',
'10:00', '19:00',
'10:00', '21:00',
'14:00', '21:00'),

(3, '14:00', '19:00',
'10:00', '19:00',
'10:00', '19:00',
'10:00', '19:00',
'10:00', '19:00',
'10:00', '21:00',
'14:00', '21:00');