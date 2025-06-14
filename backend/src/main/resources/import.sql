-- This file allow to write SQL commands that will be emitted in test and dev.
-- The commands are commented as their support depends of the database
-- insert into myentity (id, field) values(1, 'field-1');
-- insert into myentity (id, field) values(2, 'field-2');
-- insert into myentity (id, field) values(3, 'field-3');
-- alter sequence myentity_seq restart with 4;


insert into estado (nome, sigla) values('Tocantins', 'TO');
insert into estado (nome, sigla) values('Goiás', 'GO');
insert into estado (nome, sigla) values('São Paulo', 'SP');
insert into estado (nome, sigla) values('Rio de Janeiro', 'RJ');
insert into estado (nome, sigla) values('Rio Grande do Sul', 'RS');
insert into estado (nome, sigla) values('Rio Grande do Norte', 'RN');
insert into estado (nome, sigla) values('Acre', 'AC');
insert into estado (nome, sigla) values('Mato Grosso', 'MT');
insert into estado (nome, sigla) values('Espírito Santo', 'ES');
insert into estado (nome, sigla) values('Paraná', 'PR');
insert into estado (nome, sigla) values('Santa Catarina', 'SC');
insert into estado (nome, sigla) values('Minas Gerais', 'MG');
insert into estado (nome, sigla) values('Bahia', 'BA');
insert into estado (nome, sigla) values('Pernambuco', 'PE');
insert into estado (nome, sigla) values('Ceará', 'CE');
insert into estado (nome, sigla) values('Maranhão', 'MA');

insert into cidade (nome, id_estado) values('Palmas', 1);
insert into cidade (nome, id_estado) values('Paraiso', 1);
insert into cidade (nome, id_estado) values('Araguaina', 1);
insert into cidade (nome, id_estado) values('Gurupi', 1);
insert into cidade (nome, id_estado) values('Porto Nacional', 1);
insert into cidade (nome, id_estado) values('Campinas', 3);
insert into cidade (nome, id_estado) values('São Paulo', 3);
insert into cidade (nome, id_estado) values('Rio de Janeiro', 4);
insert into cidade (nome, id_estado) values('Porto Alegre', 5);
insert into cidade (nome, id_estado) values('Natal', 6);
insert into cidade (nome, id_estado) values('Rio Branco', 7);
insert into cidade (nome, id_estado) values('Cuiabá', 8);
insert into cidade (nome, id_estado) values('Vitória', 9);
insert into cidade (nome, id_estado) values('Curitiba', 10);
insert into cidade (nome, id_estado) values('Florianópolis', 11);
insert into cidade (nome, id_estado) values('Belo Horizonte', 12);
insert into cidade (nome, id_estado) values('Salvador', 13);
insert into cidade (nome, id_estado) values('Recife', 14);
insert into cidade (nome, id_estado) values('Fortaleza', 15);
insert into cidade (nome, id_estado) values('São Luís', 16);

insert into bandafrequencia (nome) values('Single-Band');
insert into bandafrequencia (nome) values('Dual-Band');
insert into bandafrequencia (nome) values('Tri-Band');
insert into bandafrequencia (nome) values('Quad-Band');

insert into protocoloseguranca (nome) values('WPA2-PSK');
insert into protocoloseguranca (nome) values('WPA3');
insert into protocoloseguranca (nome) values('WEP');
insert into protocoloseguranca (nome) values('WPA-ENTERPRISE');
insert into protocoloseguranca (nome) values('WPA-PSK');
insert into protocoloseguranca (nome) values('WPA2-ENTERPRISE');
insert into protocoloseguranca (nome) values('WPS');

insert into quantidadeantena (quantidade) values(1);
insert into quantidadeantena (quantidade) values(2);
insert into quantidadeantena (quantidade) values(3);
insert into quantidadeantena (quantidade) values(4);
insert into quantidadeantena (quantidade) values(5);
insert into quantidadeantena (quantidade) values(6);

insert into sinalwireless (nome) values('Wi-Fi 5');
insert into sinalwireless (nome) values('Wi-Fi 6');

insert into sistemaoperacional (nome) values('Cisco IOS');
insert into sistemaoperacional (nome) values('Juno OS');
insert into sistemaoperacional (nome) values('RouterOS');
insert into sistemaoperacional (nome) values('ZyNOS');

insert into fornecedor (nome, cnpj, email) values ('Prefeitura de Palmas', '24851511000185', 'palmas@to.gov.br');
insert into fornecedor (nome, cnpj, email) values ('Estado do Tocantins', '04592992000144', 'estado@to.gov.br');
insert into fornecedor (nome, cnpj, email) values ('CISCO', '00028666000158', 'cisco@cisco.com');
insert into fornecedor (nome, cnpj, email) values ('STARLINK', '53477551000107', 'starlink@starlink.com');

insert into telefone(codigoarea, numero) values ('63', '32127144');
insert into telefone(codigoarea, numero) values ('63', '32127145');
insert into telefone(codigoarea, numero) values ('63', '32127146');
insert into telefone(codigoarea, numero) values ('63', '32181111');
insert into telefone(codigoarea, numero) values ('11', '01206088');
insert into telefone(codigoarea, numero) values ('11', '08005912');

insert into telefone_fornecedor(id_fornecedor, telefones_id) values (1, 1);
insert into telefone_fornecedor(id_fornecedor, telefones_id) values (1, 2);
insert into telefone_fornecedor(id_fornecedor, telefones_id) values (1, 3);
insert into telefone_fornecedor(id_fornecedor, telefones_id) values (2, 4);
insert into telefone_fornecedor(id_fornecedor, telefones_id) values (3, 5);
insert into telefone_fornecedor(id_fornecedor, telefones_id) values (4, 6);

insert into roteador (nome, descricao, preco, id_sinalWireless, id_sistemaOperacional, id_bandaFrequencia, id_protocoloSeguranca, id_quantidadeAntena, id_fornecedor) values ('ROT WIFI GIGA AC1200MBPS 4ANT Tenda AC8', 'O AC8 é um roteador sem fio de banda dupla de Gigabit projetado especialmente para famílias com acesso por fibra. Equipado com portas de Gigabit, suporta acesso de largura de banda de até 1000 Mbps. A banda dupla fornece freqüência de 1167Mbps, utiliza totalmente a fibra de Gigabit.', 394.87, 1, 1, 2, 7, 4, 1);
insert into roteador (nome, descricao, preco, id_sinalWireless, id_sistemaOperacional, id_bandaFrequencia, id_protocoloSeguranca, id_quantidadeAntena, id_fornecedor) values ('Roteador de Firewall Cisco RV110W-A-NA-K9 RV110W Wireless N VPN', 'Firewall Cisco rv110w wireless n vpn', 899.90, 1, 1, 1, 7, 2, 3);
insert into roteador (nome, descricao, preco, id_sinalWireless, id_sistemaOperacional, id_bandaFrequencia, id_protocoloSeguranca, id_quantidadeAntena, id_fornecedor) values ('Roteador TP Link Mesh Gigabit Wi-Fi 5GHz Archer C6', 'Roteador TP-LINK Wireless Gigabit AC1200 Archer C6', 229.90, 1, 3, 2, 7, 4, 2);
insert into roteador (nome, descricao, preco, id_sinalWireless, id_sistemaOperacional, id_bandaFrequencia, id_protocoloSeguranca, id_quantidadeAntena, id_fornecedor) values ('SonicWall NSA 4700', 'Derrotar ameaças avançadas requer uma solução avançada de firewall criada para as necessidades da sua empresa. O firewall de médio alcance do dispositivo de segurança de rede Sonicwall (NSa) é de segurança de última geração projetado especificamente para empresas de 250 usuários ou mais. Trabalhe com a confiança de saber que você está protegido contra as incursões do dia a dia, bem como contra ameaças avançadas como ransomware, ataques contra portas não padrão e violações de firewalls, tudo na velocidade dos negócios.', 54763.35, 1, 4, 2, 7, 1, 4);
insert into roteador (nome, descricao, preco, id_sinalWireless, id_sistemaOperacional, id_bandaFrequencia, id_protocoloSeguranca, id_quantidadeAntena, id_fornecedor) values ('TP-Link Sistema Wi-Fi Deco X60 AX3000', 'Sistema Wi-Fi de malha residencial TP-Link Deco X60 WiFi 6 AX3000, pacote com 3', 2820.00, 1, 2, 2, 1, 1, 1);
insert into roteador (nome, descricao, preco, id_sinalWireless, id_sistemaOperacional, id_bandaFrequencia, id_protocoloSeguranca, id_quantidadeAntena, id_fornecedor) values ('Roteador AX5400 Wi-Fi 6 TP-Link Archer AX72, MU-MIMO, Beamforming', 'Roteador Wi-Fi Gigabit TP-Link ARCHER AX72. O Archer AX72 cria uma rede confiável e extremamente rápida, com tecnologia Wi-Fi 802.11ax. A banda de 2,4 GHz oferece velocidades até 574Mbps, pronto para tarefas diárias como e-mails e navegação na web, enquanto a banda de 5GHz oferece velocidades de até 4804Mbps, ideal para streaming de vídeo HD e jogos on-line lag. Com uma porta Gigabit WAN e quatro portas Gigabit LAN, as velocidades podem ser até 10 × mais rápidas do que as conexões Ethernet padrão. 6 antenas externas enviam sinais de Wi-Fi para todos os cantos da sua casa. O mais recente protocolo de segurança Wi-Fi, WPA3, traz novos recursos para melhorar a segurança cibernética em redes pessoais.', 629.90, 2, 3, 2, 2, 6, 2);
insert into roteador (nome, descricao, preco, id_sinalWireless, id_sistemaOperacional, id_bandaFrequencia, id_protocoloSeguranca, id_quantidadeAntena, id_fornecedor) values ('TP-Link AC 1350 Archer C60 Roteador Wireless Dual Band, Branco', 'Roteador Tplink Archer C60 D.Band AC1350 4P Lan 1WAN 5Antena - PN # Archer C60.Um produto de verdadeiro desempenho. Fácilidade no manuseio e conforto ao uso.Fabricante líder de produtos e acessórios de alta qualidade.', 467.58, 1, 3, 3, 7, 5, 3);
insert into roteador (nome, descricao, preco, id_sinalWireless, id_sistemaOperacional, id_bandaFrequencia, id_protocoloSeguranca, id_quantidadeAntena, id_fornecedor) values ('Roteador Wireless N TL-WR949N', 'O Roteador Wireless N TL-WR949N oferece velocidade de até 450Mbps, ideal para streaming, jogos online e conexões simultâneas. Possui 3 antenas de alto ganho, proporcionando cobertura Wi-Fi estável.M&E', 289.98, 1, 3, 4, 7, 3, 1);

insert into imagem_roteador (id_roteador, listaImagem) values (1, '4nt-ac8.jpg');
insert into imagem_roteador (id_roteador, listaImagem) values (1, '4nt-ac8-2.jpg');
insert into imagem_roteador (id_roteador, listaImagem) values (1, '4nt-ac8-3.jpg');
insert into imagem_roteador (id_roteador, listaImagem) values (1, '4nt-ac8-4.jpg');
insert into imagem_roteador (id_roteador, listaImagem) values (2, 'ciscox300.jpg');
insert into imagem_roteador (id_roteador, listaImagem) values (3, 'archerc6.jpg');
insert into imagem_roteador (id_roteador, listaImagem) values (4, 'sonicwall-nsa-4700.jpg');
insert into imagem_roteador (id_roteador, listaImagem) values (5, 'Deco_X60.jpg');
insert into imagem_roteador (id_roteador, listaImagem) values (6, 'ax5400.jpg');
insert into imagem_roteador (id_roteador, listaImagem) values (7, 'archer_c60.jpg');
insert into imagem_roteador (id_roteador, listaImagem) values (8, 'tl-wr940.jpg');

insert into lote (codigo, estoque, data, id_roteador) values ('1111', 10, '2024-01-11', 1);
insert into lote (codigo, estoque, data, id_roteador) values ('1112', 5, '2023-06-09', 1);
insert into lote (codigo, estoque, data, id_roteador) values ('2111', 10, '2023-01-07', 2);
insert into lote (codigo, estoque, data, id_roteador) values ('2112', 15, '2024-05-10', 2);

insert into lote (codigo, estoque, data, id_roteador) values ('3111', 25, '2023-02-11', 3);
insert into lote (codigo, estoque, data, id_roteador) values ('3112', 10, '2023-06-20', 3);

insert into lote (codigo, estoque, data, id_roteador) values ('4111', 20, '2023-04-11', 4);
insert into lote (codigo, estoque, data, id_roteador) values ('4112', 25, '2023-09-11', 4);

insert into lote (codigo, estoque, data, id_roteador) values ('5111', 20, '2023-03-08', 5);
insert into lote (codigo, estoque, data, id_roteador) values ('5112', 25, '2023-09-15', 5);

insert into lote (codigo, estoque, data, id_roteador) values ('6111', 20, '2023-04-01', 6);
insert into lote (codigo, estoque, data, id_roteador) values ('6112', 25, '2024-02-11', 6);

insert into lote (codigo, estoque, data, id_roteador) values ('7111', 10, '2023-07-01', 7);
insert into lote (codigo, estoque, data, id_roteador) values ('7112', 25, '2024-03-11', 7);

insert into endereco(logradouro, bairro, numero, cep, complemento, id_cidade) values ('Av. Teotônio Segurado', 'Plano Diretor Norte', '01', '77006470', 'Edificio Nobre Empresarial', 1);
insert into endereco(logradouro, bairro, numero, cep, complemento, id_cidade) values ('Esplanada Praça dos Girassóis', 'Plano Diretor Norte', '01', '77001902', 'Esplanada das Secretarias', 1);

insert into endereco_fornecedor(id_fornecedor, enderecos_id) values (1, 1);
insert into endereco_fornecedor(id_fornecedor, enderecos_id) values (2, 2);

-- inserindo cupom de desconto
insert into cupomdesconto(codigo, percentualDesconto, validade) values ('10OFF', 0.10, '2025-12-31');
insert into cupomdesconto(codigo, percentualDesconto, validade) values ('15OFF', 0.15, '2025-11-01');

-- inserindo usuario com permissao de user e de adm
insert into usuario(nome, cpf, dataNascimento, email, senha) values ('admin','12345678900','1995-03-18', 'admin@email.com', '0cctg7WgpEz7kC/AzVC+KX+bZLPXDtgJDqWWZWnmzHH+7Na2YVxYYSFPxcf7ImAjqfNckx0aT4n5qKM7WEoeEQ==');
insert into perfil_usuario(perfis, id_usuario) values (1, 1);
insert into perfil_usuario(perfis, id_usuario) values (2, 1);
insert into funcionario(id_usuario, altura) values (1, 1.78);
insert into cliente(id_usuario, datacadastro) values (1, '2024-01-16');
insert into telefone(codigoarea, numero) values ('63', '92001122');
insert into telefone(codigoarea, numero) values ('63', '92001133');
insert into telefone_usuario(id_usuario, telefones_id) values (1, 7);
insert into telefone_usuario(id_usuario, telefones_id) values (1, 8);
insert into endereco(logradouro, bairro, numero, cep, complemento, id_cidade) values ('906 Sul, Alameda 11', 'Plano Diretor Sul', '01', '77000111', 'S/C', 1);
insert into endereco_usuario(id_usuario, enderecos_id) values (1, 3);
insert into cartao(titular, numero, cvc, cpfcartao, id_cliente, modalidadecartao, datavalidade) values ('Administrador da Silva', '5530 2919 5703 9335', '675', '12345678900', 1, 1, '2029-02-02');

-- inserindo usuario com permissao apenas de user
insert into usuario(nome, cpf, dataNascimento, email, senha) values ('cliente','98765432100','2005-06-28', 'cliente@email.com', '0cctg7WgpEz7kC/AzVC+KX+bZLPXDtgJDqWWZWnmzHH+7Na2YVxYYSFPxcf7ImAjqfNckx0aT4n5qKM7WEoeEQ==');
insert into perfil_usuario(perfis, id_usuario) values (2, 2);
insert into cliente(id_usuario, datacadastro) values (2, '2024-10-19');

insert into usuario(nome, cpf, dataNascimento, email, senha) values ('carlos','87654321900','2003-02-11', 'carlos@email.com', '0cctg7WgpEz7kC/AzVC+KX+bZLPXDtgJDqWWZWnmzHH+7Na2YVxYYSFPxcf7ImAjqfNckx0aT4n5qKM7WEoeEQ==');
insert into perfil_usuario(perfis, id_usuario) values (2, 3);
insert into cliente(id_usuario, datacadastro) values (3, '2024-10-19');

insert into usuario(nome, cpf, dataNascimento, email, senha) values ('cristiano','76543219800','1999-04-12', 'cristiano@email.com', '0cctg7WgpEz7kC/AzVC+KX+bZLPXDtgJDqWWZWnmzHH+7Na2YVxYYSFPxcf7ImAjqfNckx0aT4n5qKM7WEoeEQ==');
insert into perfil_usuario(perfis, id_usuario) values (2, 4);
insert into cliente(id_usuario, datacadastro) values (4, '2024-10-19');

insert into usuario(nome, cpf, dataNascimento, email, senha) values ('cesar','65432198700','1996-02-21', 'cesar@email.com', '0cctg7WgpEz7kC/AzVC+KX+bZLPXDtgJDqWWZWnmzHH+7Na2YVxYYSFPxcf7ImAjqfNckx0aT4n5qKM7WEoeEQ==');
insert into perfil_usuario(perfis, id_usuario) values (2, 5);
insert into cliente(id_usuario, datacadastro) values (5, '2024-10-20');

insert into usuario(nome, cpf, dataNascimento, email, senha) values ('carolina','54321987600','2003-09-11', 'carolina@email.com', '0cctg7WgpEz7kC/AzVC+KX+bZLPXDtgJDqWWZWnmzHH+7Na2YVxYYSFPxcf7ImAjqfNckx0aT4n5qKM7WEoeEQ==');
insert into perfil_usuario(perfis, id_usuario) values (2, 6);
insert into cliente(id_usuario, datacadastro) values (6, '2024-10-20');

insert into usuario(nome, cpf, dataNascimento, email, senha) values ('cassia','43219876500','1992-12-26', 'cassia@email.com', '0cctg7WgpEz7kC/AzVC+KX+bZLPXDtgJDqWWZWnmzHH+7Na2YVxYYSFPxcf7ImAjqfNckx0aT4n5qKM7WEoeEQ==');
insert into perfil_usuario(perfis, id_usuario) values (2, 7);
insert into cliente(id_usuario, datacadastro) values (7, '2024-10-21');

-- inserindo usuario com permissao apenas de adm
insert into usuario(nome, cpf, dataNascimento, email, senha) values ('gerente','11223344556','1985-02-25', 'gerente@email.com', '0cctg7WgpEz7kC/AzVC+KX+bZLPXDtgJDqWWZWnmzHH+7Na2YVxYYSFPxcf7ImAjqfNckx0aT4n5qKM7WEoeEQ==');
insert into perfil_usuario(perfis, id_usuario) values (1, 8);
insert into funcionario(id_usuario, altura) values (8, 1.75);

insert into usuario(nome, cpf, dataNascimento, email, senha) values ('adriano','22334455116','1989-01-14', 'adriano@email.com', '0cctg7WgpEz7kC/AzVC+KX+bZLPXDtgJDqWWZWnmzHH+7Na2YVxYYSFPxcf7ImAjqfNckx0aT4n5qKM7WEoeEQ==');
insert into perfil_usuario(perfis, id_usuario) values (1, 9);
insert into funcionario(id_usuario, altura) values (9, 1.75);

insert into usuario(nome, cpf, dataNascimento, email, senha) values ('andre','33445511226','1991-04-25', 'andre@email.com', '0cctg7WgpEz7kC/AzVC+KX+bZLPXDtgJDqWWZWnmzHH+7Na2YVxYYSFPxcf7ImAjqfNckx0aT4n5qKM7WEoeEQ==');
insert into perfil_usuario(perfis, id_usuario) values (1, 10);
insert into funcionario(id_usuario, altura) values (10, 1.75);

insert into usuario(nome, cpf, dataNascimento, email, senha) values ('arthur','44551122336','1981-04-25', 'arthur@email.com', '0cctg7WgpEz7kC/AzVC+KX+bZLPXDtgJDqWWZWnmzHH+7Na2YVxYYSFPxcf7ImAjqfNckx0aT4n5qKM7WEoeEQ==');
insert into perfil_usuario(perfis, id_usuario) values (1, 11);
insert into funcionario(id_usuario, altura) values (11, 1.75);

insert into usuario(nome, cpf, dataNascimento, email, senha) values ('alexandre','55112233446','1987-12-15', 'alexandre@email.com', '0cctg7WgpEz7kC/AzVC+KX+bZLPXDtgJDqWWZWnmzHH+7Na2YVxYYSFPxcf7ImAjqfNckx0aT4n5qKM7WEoeEQ==');
insert into perfil_usuario(perfis, id_usuario) values (1, 12);
insert into funcionario(id_usuario, altura) values (12, 1.75);

insert into usuario(nome, cpf, dataNascimento, email, senha) values ('antonio','51122334456','1973-08-23', 'antonio@email.com', '0cctg7WgpEz7kC/AzVC+KX+bZLPXDtgJDqWWZWnmzHH+7Na2YVxYYSFPxcf7ImAjqfNckx0aT4n5qKM7WEoeEQ==');
insert into perfil_usuario(perfis, id_usuario) values (1, 13);
insert into funcionario(id_usuario, altura) values (13, 1.75);

insert into usuario(nome, cpf, dataNascimento, email, senha) values ('ana','41122334446','1966-09-13', 'ana@email.com', '0cctg7WgpEz7kC/AzVC+KX+bZLPXDtgJDqWWZWnmzHH+7Na2YVxYYSFPxcf7ImAjqfNckx0aT4n5qKM7WEoeEQ==');
insert into perfil_usuario(perfis, id_usuario) values (1, 14);
insert into funcionario(id_usuario, altura) values (14, 1.55);


-- inserindo pedido finalizar
insert into endereco(logradouro, bairro, numero, cep, complemento, id_cidade) values ('106 Sul, Alameda 11', 'Plano Diretor Sul', '01', '77000111', 'S/C', 1);
insert into endereco_usuario(id_usuario, enderecos_id) values (3, 4);
insert into cartao(titular, numero, cvc, cpfcartao, id_cliente, modalidadecartao, datavalidade) values ('Carlos de Assis', '5530 2919 5703 9335', '675', '12345678900', 3, 1, '2029-02-01');

-- insert into cartaopagamento(titular, numero, cvc, cpfcartao, modalidadecartao, datavalidade) values ('Carlos de Assis', '5530 2919 5703 9335', '675', '12345678900', 1, '2029-02-01');
-- insert into enderecoentrega(logradouro, bairro, numero, cep, complemento, id_cidade) values ('106 Sul, Alameda 11', 'Plano Diretor Sul', '01', '77000111', 'S/C', 1);
-- insert into pagamento(valor) values (394.87)
-- insert into pedido(valortotal, data, id_cliente, id_enderecoentrega, id_pagamento) values (394.87, '2025-06-05', 3, 1, 1);
-- insert into itempedido(preco, quantidade, id_lote, id_pedido) values (394.87, 1, 2, 1);

-- insert into statuspedido(situacaopedido, dataatualizacao, id_statuspedido) values (1, '2025-06-05 00:04:06', 1);
-- insert into statuspedido(situacaopedido, dataatualizacao, id_statuspedido) values (2, '2025-06-05 00:05:06', 1);