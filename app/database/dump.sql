
CREATE table users(
id int(11)  AUTO_INCREMENT PRIMARY KEY,
name varchar(150) not null,
email varchar(255) not null UNIQUE,
password varchar(255) not null,
token varchar(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP(),
deleted_at TIMESTAMP  NULL
) CHARACTER SET utf8 COLLATE utf8_general_ci;


ALTER TABLE users ADD INDEX idx_users_deleted (deleted_at);


CREATE TABLE groups(
	id int(11) AUTO_INCREMENT PRIMARY KEY,
	name varchar(150) not null,
	slug varchar(255)
) CHARACTER SET utf8 COLLATE utf8_general_ci;


CREATE TABLE user_groups(
	id int(11) AUTO_INCREMENT PRIMARY KEY,
	user_id int(11) not null,
	group_id int(11) not null,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
	FOREIGN KEY (user_id) references users(id),
	FOREIGN KEY (group_id) REFERENCES groups(id),
	UNIQUE idx_unique_usr_grp (user_id, group_id) 
) CHARACTER SET utf8 COLLATE utf8_general_ci;