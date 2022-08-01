CREATE TABLE amount (
	id serial PRIMARY KEY,
	amount FLOAT ( 8 ) NOT NULL
);

INSERT INTO amount (amount) VALUES(0);

SELECT amount FROM amount WHERE id = 1;

UPDATE amount SET amount = 123.45 WHERE id = 1;