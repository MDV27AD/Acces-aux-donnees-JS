USE `central`;

-- Stored procedure
DELIMITER $$
CREATE PROCEDURE `get_products_for_gamez`()
NOT DETERMINISTIC
READS SQL DATA
SQL SECURITY DEFINER
BEGIN
    DECLARE category_id_1 INT UNSIGNED;
    DECLARE category_id_2 INT UNSIGNED;

    -- Getting the ID of the allowed categories for the concerned distributor
    SELECT `id` INTO category_id_1 FROM `central`.`category` WHERE `name` = 'Jeux vidéos' LIMIT 1;
    SELECT `id` INTO category_id_2 FROM `central`.`category` WHERE `name` = 'Jeux de société' LIMIT 1;

    -- Getting the products list
    SELECT * FROM `central`.`product` WHERE
        `id_category` = category_id_1 OR
        `id_category` = category_id_2
    ;
END $$
DELIMITER ;

-- User
CREATE USER 'gamez_user'@'localhost' IDENTIFIED BY 'ssuNB_SRGHA44WX£%§_5678IOùm:LK?NIBGYO8-rod(tyrfo-)';
GRANT EXECUTE ON PROCEDURE `central`.`get_products_for_gamez` TO 'gamez_user'@'localhost';
FLUSH PRIVILEGES;