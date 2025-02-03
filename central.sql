-- Database
CREATE DATABASE `central`
DEFAULT CHARACTER SET UTF8MB4 COLLATE utf8mb4_unicode_ci;
USE `central`;

-- Tables
CREATE TABLE `product`(
    product_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    sku VARCHAR(15) NOT NULL,
    serial_number INT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price BIGINT NOT NULL,
    status ENUM('available', 'out_of_stock') NOT NULL DEFAULT 'available',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    distributor_id INT UNSIGNED NOT NULL
) ENGINE = InnoDB;

CREATE TABLE `distributor`(
    distributor_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE `category`(
    category_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE `product_category`(
    id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    product_id INT UNSIGNED NOT NULL,
    category_id INT UNSIGNED NOT NULL
) ENGINE = InnoDB;

-- Foreign keys
ALTER TABLE `product` ADD FOREIGN KEY (`distributor_id`) REFERENCES `distributor` (`distributor_id`);
ALTER TABLE `product_category` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`);
ALTER TABLE `product_category` ADD FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`);

-- Stored procedures
--Coming soon...

-- Triggers
DELIMITER $$

CREATE TRIGGER product_pre_update
BEFORE UPDATE ON product
FOR EACH ROW
BEGIN
    -- Forbidding the created_at field to be modified
    IF NEW.created_at <> OLD.created_at THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'You cannot change created_at time of an item.';
    END IF;

    -- Updating the updated_at field
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END $$

CREATE TRIGGER distributor_pre_update
BEFORE UPDATE ON distributor
FOR EACH ROW
BEGIN
    -- Forbidding the created_at field to be modified
    IF NEW.created_at <> OLD.created_at THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'You cannot change created_at time of an item.';
    END IF;

    -- Updating the updated_at field
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END $$

CREATE TRIGGER category_pre_update
BEFORE UPDATE ON category
FOR EACH ROW
BEGIN
    -- Forbidding the created_at field to be modified
    IF NEW.created_at <> OLD.created_at THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'You cannot change created_at time of an item.';
    END IF;
END $$

DELIMITER ;

-- Users
CREATE USER 'central_user'@'localhost' IDENTIFIED BY 'NBFR5678IOùm:LK?NIBO87TIGYO8-rod(tyrfo-)';
GRANT SELECT, EXECUTE ON `central`.* TO 'central_user'@'localhost';
FLUSH PRIVILEGES;