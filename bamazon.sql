CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products(
	item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
	PRIMARY KEY (item_id),
	product_name VARCHAR(100) NULL,
	department_name VARCHAR(100) NULL,
	price INTEGER NOT NULL,
	stock_quantity INTEGER(10) NOT NULL
);

-- make csv for import

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Taun", "Ingredients", 15, 10),
("Bomb", "Bombs", 100, 5),
("Mining Bomb", "Bombs", 120, 5),
("Zettel", "Papers", 50, 5),
("Cloth", "Textiles", 40, 5),
("Ingot", "Metals", 50, 5),
("Magic Grass", "Ingredients", 10, 10),
("Water", "Ingredients", 10, 10),
("Dragon Claw", "Ingredients", 2000, 1),
("Screws", "Ingredients", 30, 10);