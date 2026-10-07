CREATE DATABASE IF NOT EXISTS gadgets CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gadgets;
CREATE TABLE IF NOT EXISTS users(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(150) NOT NULL,phone VARCHAR(40),email VARCHAR(180) NOT NULL UNIQUE,password_hash VARCHAR(255) NOT NULL,active TINYINT(1) DEFAULT 1,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE categories(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(100) NOT NULL UNIQUE,sort_order INT DEFAULT 0,active TINYINT(1) DEFAULT 1);
CREATE TABLE products(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(180) NOT NULL,category VARCHAR(100) NOT NULL,price DECIMAL(12,2) NOT NULL,image_url TEXT,icon VARCHAR(20) DEFAULT '▣',details TEXT,active TINYINT(1) DEFAULT 1,featured TINYINT(1) DEFAULT 0,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE orders(id INT AUTO_INCREMENT PRIMARY KEY,order_no VARCHAR(60) UNIQUE NOT NULL,customer_name VARCHAR(150) NOT NULL,phone VARCHAR(40) NOT NULL,email VARCHAR(180) NOT NULL,address TEXT NOT NULL,payment_method VARCHAR(80) NOT NULL,total DECIMAL(12,2) NOT NULL,note TEXT,status VARCHAR(40) DEFAULT 'Pending',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE order_items(id INT AUTO_INCREMENT PRIMARY KEY,order_id INT NOT NULL,product_id INT,product_name VARCHAR(180) NOT NULL,qty INT NOT NULL,price DECIMAL(12,2) NOT NULL,FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE);
CREATE TABLE agents(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(150) NOT NULL,phone VARCHAR(40),email VARCHAR(180),whatsapp VARCHAR(255),messenger VARCHAR(255),active TINYINT(1) DEFAULT 1);
CREATE TABLE quick_messages(id INT AUTO_INCREMENT PRIMARY KEY,message TEXT NOT NULL,sort_order INT DEFAULT 0,active TINYINT(1) DEFAULT 1);
CREATE TABLE store_settings(setting_key VARCHAR(100) PRIMARY KEY,setting_value TEXT);
INSERT INTO categories(name,sort_order) VALUES
('Desktop',1),('Laptop',2),('Component',3),('Monitor',4),('Power',5),('Phone',6),('Tablet',7),('Office Equipment',8),('Camera',9),('Security',10),('Networking',11),('Software',12),('Server & Storage',13),('Accessories',14),('Gadget',15),('Gaming',16),('TV',17),('Appliance',18);
INSERT INTO products(name,category,price,image_url,details,featured) VALUES
('Apple MacBook Air 13','Laptop',129900,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85','M3 · 8GB · 256GB SSD',1),
('Dell XPS 13','Laptop',145000,'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85','Core Ultra · 16GB · 512GB SSD',1),
('Lenovo Legion 5','Gaming',139900,'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=900&q=85','Ryzen 7 · 16GB · RTX graphics',1),
('ASUS ROG G16','Gaming',179900,'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=85','Core i9 · 16GB · RTX 4070',1),
('Creator Desktop PC','Desktop',165000,'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=900&q=85','Ryzen 7 · 32GB · RTX 4070',1),
('Dell UltraSharp 27','Monitor',59000,'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=85','27-inch 4K IPS display',1),
('Logitech MX Keys','Accessories',12500,'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85','Wireless productivity keyboard',0),
('Razer DeathAdder V3','Accessories',8500,'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=85','Ergonomic gaming mouse',0);
INSERT INTO quick_messages(message,sort_order) VALUES('Hi! How can I help you today?',1),('Tell me your budget and device type.',2),('I can compare products for you.',3);
INSERT INTO store_settings(setting_key,setting_value) VALUES('store_name','Gadgets'),('support_email','support@example.com'),('facebook',''),('instagram',''),('youtube',''),('whatsapp','');