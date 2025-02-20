-- Cleaning database and users
DROP DATABASE IF EXISTS `central`;
DROP USER IF EXISTS 'central_user'@'localhost';

-- Database
CREATE DATABASE `central`
DEFAULT CHARACTER SET UTF8MB4 COLLATE utf8mb4_unicode_ci;
USE `central`;

-- Tables
CREATE TABLE `product`(
    id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    sku VARCHAR(15) NOT NULL,
    serial_number INT UNSIGNED UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price MEDIUMINT UNSIGNED NOT NULL,
    status ENUM('available', 'out_of_stock') NOT NULL DEFAULT 'available',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_category INT UNSIGNED NOT NULL,
    id_supplier INT UNSIGNED NOT NULL
) ENGINE = InnoDB;

CREATE TABLE `supplier`(
    id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE `distributor`(
    id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE `category`(
    id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE `category_distributor`(
    id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_category INT UNSIGNED NOT NULL,
    id_distributor INT UNSIGNED NOT NULL
) ENGINE = InnoDB;

-- Foreign keys
ALTER TABLE `product` ADD FOREIGN KEY (`id_supplier`) REFERENCES `supplier` (`id`);
ALTER TABLE `product` ADD FOREIGN KEY (`id_category`) REFERENCES `category` (`id`);
ALTER TABLE `category_distributor` ADD FOREIGN KEY (`id_category`) REFERENCES `category` (`id`);
ALTER TABLE `category_distributor` ADD FOREIGN KEY (`id_distributor`) REFERENCES `distributor` (`id`);

-- Stored procedures
DELIMITER $$

CREATE PROCEDURE `add_product`(    
    IN `new_sku` VARCHAR(15),
    IN `new_serial_number` INT UNSIGNED,
    IN `new_name` VARCHAR(255),
    IN `new_description` TEXT,
    IN `new_price` MEDIUMINT UNSIGNED,
    IN `new_category` VARCHAR(255),
    IN `new_supplier` VARCHAR(255)
)
NOT DETERMINISTIC
MODIFIES SQL DATA
SQL SECURITY DEFINER
BEGIN
    DECLARE category_id INT UNSIGNED;
    DECLARE supplier_id INT UNSIGNED;

    -- Checking parameters
    IF new_sku = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'new_sku cannot be null.';
    END IF;
    IF new_serial_number = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'new_serial_number cannot be null.';
    END IF;
    IF new_name = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'new_name cannot be null.';
    END IF;
    IF new_description = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'new_description cannot be null.';
    END IF;
    IF new_price = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'new_price cannot be null.';
    END IF;
    IF new_category = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'new_category cannot be null.';
    END IF;
    IF new_supplier = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'new_supplier cannot be null.';
    END IF;

    -- Creating the new category if it doesn't exist
    SELECT `id` INTO category_id FROM `category` WHERE `name` = new_category LIMIT 1;
    IF category_id IS NULL THEN
        INSERT INTO `category` (`name`) VALUES (new_category);
        SELECT `id` INTO category_id FROM `category` WHERE `name` = new_category LIMIT 1;
    END IF;

    -- Creating the new supplier if it doesn't exist
    SELECT `id` INTO supplier_id FROM `supplier` WHERE `name` = new_supplier LIMIT 1;
    IF supplier_id IS NULL THEN
        INSERT INTO `supplier` (`name`) VALUES (new_supplier);
        SELECT `id` INTO supplier_id FROM `supplier` WHERE `name` = new_supplier LIMIT 1;
    END IF;

    -- Creating the new product
    INSERT INTO `product` (
        `sku`,
        `serial_number`,
        `name`,
        `description`,
        `price`,
        `id_category`,
        `id_supplier`
    )
    VALUES (
        new_sku,
        new_serial_number,
        new_name,
        new_description,
        new_price,
        category_id,
        supplier_id
    );
END $$

CREATE PROCEDURE `modify_product`(    
    IN `modified_product_id` INT UNSIGNED,
    IN `new_sku` VARCHAR(15),
    IN `new_name` VARCHAR(255),
    IN `new_description` TEXT,
    IN `new_price` MEDIUMINT UNSIGNED,
    IN `new_status` ENUM('available', 'out_of_stock'),
    IN `new_category` VARCHAR(255),
    IN `new_supplier` VARCHAR(255)
)
NOT DETERMINISTIC
MODIFIES SQL DATA
SQL SECURITY DEFINER
BEGIN
    DECLARE category_id INT UNSIGNED;
    DECLARE supplier_id INT UNSIGNED;

    -- Checking parameters
    IF modified_product_id = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'modified_product_id cannot be null.';
    END IF;
    IF new_sku = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'new_sku cannot be null.';
    END IF;
    IF new_name = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'new_name cannot be null.';
    END IF;
    IF new_description = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'new_description cannot be null.';
    END IF;
    IF new_price = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'new_price cannot be null.';
    END IF;
    IF new_status != 'available' AND new_status != 'out_of_stock' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid new_status : "available" or "out_of_stock" expected.';
    END IF;
    IF new_category = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'new_category cannot be null.';
    END IF;
    IF new_supplier = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'new_supplier cannot be null.';
    END IF;

    -- Checking if the requested product exists
    IF NOT EXISTS (SELECT '' FROM `product` WHERE `id` = modified_product_id LIMIT 1) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The requested product does not exist.';
    END IF;

    -- Creating the new category if it doesn't exist
    SELECT `id` INTO category_id FROM `category` WHERE `name` = new_category LIMIT 1;
    IF category_id IS NULL THEN
        INSERT INTO `category` (`name`) VALUES (new_category);
        SELECT `id` INTO category_id FROM `category` WHERE `name` = new_category LIMIT 1;
    END IF;

    -- Creating the new supplier if it doesn't exist
    SELECT `id` INTO supplier_id FROM `supplier` WHERE `name` = new_supplier LIMIT 1;
    IF supplier_id IS NULL THEN
        INSERT INTO `supplier` (`name`) VALUES (new_supplier);
        SELECT `id` INTO supplier_id FROM `supplier` WHERE `name` = new_supplier LIMIT 1;
    END IF;

    -- Updating the product
    UPDATE `product` SET
        `sku`           = new_sku,
        `name`          = new_name,
        `description`   = new_description,
        `price`         = new_price,
        `status`        = new_status,
        `id_category`   = category_id,
        `id_supplier`   = supplier_id
    WHERE `id` = modified_product_id;
END $$

CREATE PROCEDURE `modify_supplier`(
    IN `modified_supplier_id` INT UNSIGNED,
    IN `new_name` VARCHAR(255),
    IN `new_status` ENUM('active', 'inactive')
)
NOT DETERMINISTIC
MODIFIES SQL DATA
SQL SECURITY DEFINER
BEGIN
    -- Checking parameters
    IF modified_supplier_id = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'modified_supplier_id cannot be null.';
    END IF;
    IF new_name = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'new_name cannot be null.';
    END IF;
    IF new_status != 'active' AND new_status != 'inactive' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid new_status : "active" or "inactive" expected.';
    END IF;

    -- Checking if the requested supplier exists
    IF NOT EXISTS (SELECT '' FROM `supplier` WHERE `id` = modified_supplier_id LIMIT 1) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The requested supplier does not exist.';
    END IF;

    -- Updating the supplier
    UPDATE `supplier` SET
        `name` = new_name,
        `status` = new_status
    WHERE `id` = modified_supplier_id;
END $$

CREATE PROCEDURE `delete_supplier`(IN `deleted_supplier_id` INT UNSIGNED)
NOT DETERMINISTIC
MODIFIES SQL DATA
SQL SECURITY DEFINER
BEGIN
    -- Checking parameters
    IF deleted_supplier_id = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'deleted_supplier_id cannot be null.';
    END IF;

    -- Checking if the requested supplier exists
    IF NOT EXISTS (SELECT '' FROM `supplier` WHERE `id` = deleted_supplier_id LIMIT 1) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The requested supplier does not exist.';
    END IF;

    -- Deleting the supplier and its products
    DELETE FROM `product` WHERE `id_supplier` = deleted_supplier_id;
    DELETE FROM `supplier` WHERE `id` = deleted_supplier_id;
END $$

CREATE PROCEDURE `delete_product`(IN `deleted_product_sn` INT UNSIGNED)
NOT DETERMINISTIC
MODIFIES SQL DATA
SQL SECURITY DEFINER
BEGIN
    DECLARE product_category VARCHAR(255);

    -- Checking parameters
    IF deleted_product_sn IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'deleted_product_sn cannot be null.';
    END IF;

    -- Checking if the requested product exists
    IF NOT EXISTS (SELECT '' FROM `product` WHERE `serial_number` = deleted_product_sn LIMIT 1) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The requested product does not exist.';
    END IF;

    -- Getting the product category before deleting it
    SELECT `category`.`name` INTO product_category FROM `product`
    INNER JOIN `category` ON `product`.`id_category` = `category`.`id`
    WHERE `serial_number` = deleted_product_sn
    LIMIT 1;

    -- Deleting the product
    DELETE FROM `product` WHERE `serial_number` = deleted_product_sn;

    -- Returning the product category
    SELECT product_category AS category;
END $$

CREATE PROCEDURE `get_all_products`()
NOT DETERMINISTIC
READS SQL DATA
SQL SECURITY DEFINER
BEGIN
    -- Getting all products list and their informations
    SELECT 
        `product`.`id`,
        `product`.`sku`,
        `product`.`name`,
        `product`.`serial_number`,
        `product`.`description`,
        `product`.`price`,
        `product`.`status`,
        `supplier`.`name` AS `supplier`,
        `supplier`.`id` AS `supplierId`,
        `category`.`name` AS `category`
    FROM `product`
    LEFT JOIN `category` ON `category`.`id` = `product`.`id_category`
    LEFT JOIN `supplier` ON `supplier`.`id` = `product`.`id_supplier`;
END $$

CREATE PROCEDURE `get_product`(IN `product_id` INT UNSIGNED)
NOT DETERMINISTIC
READS SQL DATA
SQL SECURITY DEFINER
BEGIN
    -- Checking parameters
    IF product_id = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'product_id cannot be null.';
    END IF;

    -- Checking if the requested product exists
    IF NOT EXISTS (SELECT '' FROM `product` WHERE `id` = product_id LIMIT 1) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The requested product does not exist.';
    END IF;

    -- Getting the product's informations
    SELECT 
        `product`.`id`,
        `product`.`sku`,
        `product`.`name`,
        `product`.`serial_number`,
        `product`.`description`,
        `product`.`price`,
        `product`.`status`,
        `supplier`.`name` AS `supplier`,
        `supplier`.`id` AS `supplierId`,
        `category`.`name` AS `category`
    FROM `product`
    LEFT JOIN `category` ON `category`.`id` = `product`.`id_category`
    LEFT JOIN `supplier` ON `supplier`.`id` = `product`.`id_supplier`
    WHERE `product`.`id` = product_id;
END $$

CREATE PROCEDURE `get_all_distributors`()
NOT DETERMINISTIC
READS SQL DATA
SQL SECURITY DEFINER
BEGIN
    -- Getting all distributors list and their informations
    SELECT * FROM `distributor`;
END $$

CREATE PROCEDURE `get_distributor`(IN `distributor_id` INT UNSIGNED)
NOT DETERMINISTIC
READS SQL DATA
SQL SECURITY DEFINER
BEGIN
    -- Checking parameters
    IF distributor_id = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'distributor_id cannot be null.';
    END IF;

    -- Checking if the requested distributor exists
    IF NOT EXISTS (SELECT '' FROM `distributor` WHERE `id` = distributor_id LIMIT 1) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The requested distributor does not exist.';
    END IF;

    -- Getting the distributor's informations
    SELECT * FROM `distributor` WHERE `id` = distributor_id;
END $$

CREATE PROCEDURE `get_all_categories`()
NOT DETERMINISTIC
READS SQL DATA
SQL SECURITY DEFINER
BEGIN
    -- Getting all distributors list and their informations
    SELECT * FROM `category`;
END $$

CREATE PROCEDURE `get_category`(IN `category_id` INT UNSIGNED)
NOT DETERMINISTIC
READS SQL DATA
SQL SECURITY DEFINER
BEGIN
    -- Checking parameters
    IF category_id = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'category_id cannot be null.';
    END IF;

    -- Checking if the requested category exists
    IF NOT EXISTS (SELECT '' FROM `category` WHERE `id` = category_id LIMIT 1) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The requested category does not exist.';
    END IF;

    -- Getting the distributor's informations
    SELECT * FROM `category` WHERE `id` = category_id;
END $$

CREATE PROCEDURE `toggle_distributor_status`(IN `distributor_id` INT UNSIGNED)
NOT DETERMINISTIC
MODIFIES SQL DATA
SQL SECURITY DEFINER
BEGIN
    -- Checking parameters
    IF distributor_id = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'distributor_id cannot be null.';
    END IF;

    -- Checking if the requested distributor exists
    IF NOT EXISTS (SELECT '' FROM `distributor` WHERE `id` = distributor_id LIMIT 1) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The requested distributor does not exist.';
    END IF;

    -- Updating the distributor's status
    UPDATE `distributor` SET `status` = (2 - `status` + 1) WHERE `id` = distributor_id;

    -- Returning the new distributor's status
    SELECT `status` FROM `distributor` WHERE `id` = distributor_id;
END $$

DELIMITER ;

-- Triggers
DELIMITER //

CREATE TRIGGER `product_pre_update`
BEFORE UPDATE ON product
FOR EACH ROW
BEGIN
    -- Forbidding the created_at field to be modified
    IF NEW.created_at <> OLD.created_at THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'You cannot change the created_at time of an item.';
    END IF;

    -- Forbidding the serial_number field to be modified
    IF NEW.serial_number <> OLD.serial_number THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'You cannot change the serial_number of a product.';
    END IF;

    -- Updating the updated_at field
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

CREATE TRIGGER `supplier_pre_update`
BEFORE UPDATE ON supplier
FOR EACH ROW
BEGIN
    -- Forbidding the created_at field to be modified
    IF NEW.created_at <> OLD.created_at THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'You cannot change the created_at time of an item.';
    END IF;

    -- Updating the updated_at field
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

CREATE TRIGGER `category_pre_update`
BEFORE UPDATE ON category
FOR EACH ROW
BEGIN
    -- Forbidding the created_at field to be modified
    IF NEW.created_at <> OLD.created_at THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'You cannot change the created_at time of an item.';
    END IF;
END //

DELIMITER ;

-- Users
CREATE USER 'central_user'@'localhost' IDENTIFIED BY 'NBFR5678IOùm:LK?NIBO87TIGYO8-rod(tyrfo-)';
GRANT EXECUTE ON PROCEDURE `get_all_products` TO 'central_user'@'localhost';
GRANT EXECUTE ON PROCEDURE `get_product` TO 'central_user'@'localhost';
GRANT EXECUTE ON PROCEDURE `add_product` TO 'central_user'@'localhost';
GRANT EXECUTE ON PROCEDURE `modify_product` TO 'central_user'@'localhost';
GRANT EXECUTE ON PROCEDURE `delete_product` TO 'central_user'@'localhost';
GRANT EXECUTE ON PROCEDURE `modify_supplier` TO 'central_user'@'localhost';
GRANT EXECUTE ON PROCEDURE `delete_supplier` TO 'central_user'@'localhost';
GRANT EXECUTE ON PROCEDURE `get_all_distributors` TO 'central_user'@'localhost';
GRANT EXECUTE ON PROCEDURE `get_distributor` TO 'central_user'@'localhost';
GRANT EXECUTE ON PROCEDURE `get_all_categories` TO 'central_user'@'localhost';
GRANT EXECUTE ON PROCEDURE `get_category` TO 'central_user'@'localhost';
GRANT EXECUTE ON PROCEDURE `toggle_distributor_status` TO 'central_user'@'localhost';
FLUSH PRIVILEGES;