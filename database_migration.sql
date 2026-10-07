USE gadgets;
CREATE TABLE IF NOT EXISTS categories(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(100) NOT NULL UNIQUE,sort_order INT DEFAULT 0,active TINYINT(1) DEFAULT 1);
ALTER TABLE products ADD COLUMN image_url TEXT NULL;
ALTER TABLE agents ADD COLUMN whatsapp VARCHAR(255) NULL, ADD COLUMN messenger VARCHAR(255) NULL;
INSERT IGNORE INTO categories(name,sort_order) VALUES('Desktop',1),('Laptop',2),('Component',3),('Monitor',4),('Power',5),('Phone',6),('Tablet',7),('Office Equipment',8),('Camera',9),('Security',10),('Networking',11),('Software',12),('Server & Storage',13),('Accessories',14),('Gadget',15),('Gaming',16),('TV',17),('Appliance',18);