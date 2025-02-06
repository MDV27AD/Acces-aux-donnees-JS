USE `central`;

-- Stored procedure
DELIMITER $$
CREATE PROCEDURE `get_products_for_sportsalut`()
NOT DETERMINISTIC
READS SQL DATA
SQL SECURITY DEFINER
BEGIN
    DECLARE category_id INT UNSIGNED;

    -- Getting the ID of the allowed categories for the concerned distributor
    SELECT `id` INTO category_id FROM `category` WHERE `name` = 'Sport' LIMIT 1;

    -- Getting the products list
    SELECT * FROM `product` WHERE `id_category` = category_id;
END $$
DELIMITER ;

-- User
CREATE USER 'sportsalut_user'@'localhost' IDENTIFIED BY 'ssuNB_SRGHA44WX£%§_5678IOùm:LK?NIBGYO8-rod(tyrfo-)';
GRANT EXECUTE ON PROCEDURE `get_products_for_sportsalut` TO 'sportsalut_user'@'localhost';
FLUSH PRIVILEGES;