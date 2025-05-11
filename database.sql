use nodejs;

create table users (
	idx int auto_increment primary key,
    userid varchar(50) unique not null,
    password varchar(200) not null,
    name varchar(20) not null,
    email varchar(50) not null,
    url varchar(200)
);

create table posts(
	idx int auto_increment primary key,
    useridx int not null, 
    createAt datetime default now(),
    text varchar(2000) not null,
    foreign key(useridx) references users(idx)
);

desc users;
desc posts;

select * from users;
select * from posts;

select * from users where useid='apple';
INSERT INTO users (userid, password, name, email) VALUES ('apple', '1111', '김사과', 'apple@apple.com','https://randomuser.me/api/portraits/women/32.jpg');
SELECT * FROM users WHERE idx = 2;
insert into posts (useridx, text) values (2, '안녕하세요!');

select u.userid, u.name, u.url, p.idx, p.useridx, p.text, p.createAt from users as u join posts as p on u.idx = p.useridx;
update posts set text='바뀐 글!!!' where idx=2; 

