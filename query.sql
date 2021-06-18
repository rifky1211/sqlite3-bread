CREATE TABLE crud(
    id_data INTEGER PRIMARY KEY AUTOINCREMENT,
    string varchar(10) not null,
    angka int(10) not null,
    desimal decimal(3,2) not null,
    tanggal date,
    booleann BOOLEAN
);

insert into crud(string,angka,desimal,tanggal,booleann) values
('Testing Data', 1, 1.45, '2000-11-11', true),
('Super Sekali', 1, 1.45, '2000-11-11', false),
('Ayam', 1, 1.45, '2000-11-11', true);