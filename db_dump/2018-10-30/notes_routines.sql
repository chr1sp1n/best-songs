-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: notes
-- ------------------------------------------------------
-- Server version	5.7.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping routines for database 'notes'
--
/*!50003 DROP PROCEDURE IF EXISTS `createUpdate` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `createUpdate`(IN `id_best_songs` BIGINT(20), IN `id_user` BIGINT(20), IN `title` VARCHAR(255), IN `rating` TINYINT(3), IN `tags` VARCHAR(45), IN `youtube_url` VARCHAR(255), IN `data` BLOB, IN `state` TINYINT(3))
BEGIN
    SET @id = 0;
    
    SELECT `best_songs`.`id_best_songs` INTO @id
    FROM `notes`.`best_songs`
    WHERE `best_songs`.`id_best_songs` = `id_best_songs`
    AND `best_songs`.`state` > 0; 
    
	IF ( @id = 0 ) THEN
		BEGIN
			INSERT INTO `notes`.`best_songs`
            (
                `best_songs`.`title`,
                `best_songs`.`rating`,
                `best_songs`.`tags`,
                `best_songs`.`youtube_url`,
                `best_songs`.`data`,
                `best_songs`.`state`,
                `best_songs`.`id_user`
            )
            VALUES
            (				
                `title`,   
                `rating`,
                `tags`,
                `youtube_url`,
                `data`,
                `state`,
                `id_user`
            );
			SELECT LAST_INSERT_ID() INTO @id;
		END;
	ELSE
		BEGIN
			UPDATE `notes`.`best_songs`
			SET
                `best_songs`.`title` 	 	= `title`,
                `best_songs`.`rating` 	 	= `rating`,
                `best_songs`.`tags` 	 	= `tags`,
                `best_songs`.`youtube_url` 	= `youtube_url`,
                `best_songs`.`data`			= `data`,
                `best_songs`.`state`		= `state`,
                `best_songs`.`id_user`		= `id_user`,
                `best_songs`.`last_edit` 	= NOW()
			WHERE `best_songs`.`id_best_songs` = @id;
        END;
    END IF;
    
	call `notes`.read(@id, `id_user`, NULL);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `read` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `read`(IN `id_best_songs` BIGINT(20), IN `id_user` BIGINT(20), IN `sorting` VARCHAR(255))
BEGIN
        
    IF `id_best_songs` = 0 THEN
		BEGIN
        			
			SELECT 				
				`best_songs`.`id_best_songs`,
				`best_songs`.`id_user`,
                `best_songs`.`title`,
				`best_songs`.`rating`,
				`best_songs`.`tags`,
				`best_songs`.`youtube_url`,
				`best_songs`.`data`,                
                `best_songs`.`state`,
                `users`.`name` AS 'userName'
			FROM `notes`.`best_songs` 
            JOIN `notes`.`users`
            ON `best_songs`.`id_user` = `users`.`id_user`
                        
			WHERE `best_songs`.`state` > 0    
            AND `users`.`state` > 0
            AND (
				`best_songs`.`id_user` = `id_user` 
                #OR `best_songs`.`state` = 2 
                OR `best_songs`.`state` = 3
			)
            
            ORDER BY 
				CASE 
					WHEN LOWER(`sorting`)='id_best_songs' THEN `best_songs`.`id_best_songs`                    
					WHEN LOWER(`sorting`)='title' THEN `best_songs`.`title`
					WHEN LOWER(`sorting`)='rating' THEN `best_songs`.`rating`
					WHEN LOWER(`sorting`)='creation_date_time' THEN `best_songs`.`creation_date_time`
                    WHEN LOWER(`sorting`)='last_edit' THEN `best_songs`.`last_edit`
				END;
					
		END;
	ELSE
		BEGIN
        
			SELECT				
				`best_songs`.`id_best_songs`,
				`best_songs`.`id_user`,
                `best_songs`.`title`,
				`best_songs`.`rating`,
				`best_songs`.`tags`,
				`best_songs`.`youtube_url`,
				`best_songs`.`data`,                
                `best_songs`.`state`,
                `users`.`name` AS 'userName'
			FROM `notes`.`best_songs`
            JOIN `notes`.`users`
            ON `best_songs`.`id_user` = `users`.`id_user`            
            
			WHERE `best_songs`.`state` > 0
            AND `users`.`state` > 0
            AND `best_songs`.`id_best_songs` = `id_best_songs`
            AND (
				`best_songs`.`id_user` = `id_user` 
                OR `best_songs`.`state` = 2 
                OR `best_songs`.`state` = 3
			);

		END;
	END IF;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `userCreateUpdate` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `userCreateUpdate`(IN `id_user` BIGINT(20), IN `email` VARCHAR(255), IN `password` VARCHAR(255), IN `name` VARCHAR(255), IN `picture` VARCHAR(255), IN `sign_in` TINYINT(3), IN `state` TINYINT(3))
BEGIN

	SET @id = 0;
    
    SELECT `users`.`id_user` INTO @id
    FROM `notes`.`users`
    WHERE `users`.`id_user` = `id_user`
    AND `users`.`state` > 0; 
    
	IF ( @id = 0 ) THEN
		BEGIN
			INSERT INTO `notes`.`users`
            (
                `users`.`email`,
                `users`.`name`,
                `users`.`picture`                
            )
            VALUES
            (
                `email`,   
                `name`,
                `picture`
            );
			SELECT LAST_INSERT_ID() INTO @id;
		END;
	ELSE
		BEGIN
			BEGIN
				UPDATE `notes`.`users`
				SET
					`users`.`email` 	 	= `email`,
					`users`.`name` 	 		= `name`,
					`users`.`picture` 		= `picture`,
					`users`.`last_edit` 	= NOW()
				WHERE `users`.`id_user` 	= @id;                
			END;
        END;
    END IF;
    
	IF ( `sign_in` > 0 ) THEN
		BEGIN
			UPDATE `notes`.`users`
			SET
				`users`.`last_sign_in` 	= NOW()
			WHERE `users`.`id_user` 	= @id;				
		END;
	END IF;    
    
	IF ( `password` IS NOT NULL) THEN
		BEGIN
			UPDATE `notes`.`users`
			SET
				`users`.`password` 	 	= SHA2(`password`, 512),
				`users`.`last_edit` 	= NOW(),
                `users`.`state` 		= 1
			WHERE `users`.`id_user` 	= @id;				
		END;
	END IF;     
    
	call `notes`.userRead(@id, NULL, NULL, NULL);
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `userRead` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `userRead`(IN `id_user` BIGINT(20), IN `email` VARCHAR(255), IN `password` VARCHAR(255), IN `sorting` VARCHAR(255))
BEGIN

    IF `id_user` = 0 AND `email` IS NULL THEN
		BEGIN
			SELECT 				
				`users`.`id_user`,
				`users`.`email`,
				`users`.`name`,
				`users`.`picture`,
                `users`.`last_sign_in`,
                `users`.`creation_date_time`,
                `users`.`last_edit`,
				`users`.`state`				
			FROM `notes`.`users`
			WHERE `users`.`state` > 0
            ORDER BY 
				CASE 
					WHEN LOWER(`sorting`) = 'id_user' THEN `users`.`id_user`                    
					WHEN LOWER(`sorting`) = 'email' THEN `users`.`email`
					WHEN LOWER(`sorting`) = 'name' THEN `users`.`name`
					WHEN LOWER(`sorting`) = 'last_sign_in' THEN `users`.`last_sign_in`
                    WHEN LOWER(`sorting`) = 'creation_date_time' THEN `users`.`creation_date_time`
                    WHEN LOWER(`sorting`) = 'last_edit' THEN `users`.`last_edit`                    
				END;
					
		END;        
	ELSEIF `email` IS NOT NULL AND `password` IS NOT NULL THEN
		BEGIN 
        
			SELECT				
				`users`.`id_user`,
				`users`.`email`,
				`users`.`name`,
				`users`.`picture`,
                `users`.`last_sign_in`,
                `users`.`creation_date_time`,
                `users`.`last_edit`,
				`users`.`state`			
			FROM `notes`.`users`
			WHERE `users`.`email` = `email`
            AND `users`.`password` = SHA2(`password`, 512)
            AND `users`.`state` > 0;			
            
        END;
	ELSEIF `email` IS NOT NULL THEN
		BEGIN 
			SELECT				
				`users`.`id_user`,
				`users`.`email`,
				`users`.`name`,
				`users`.`picture`,
                `users`.`last_sign_in`,
                `users`.`creation_date_time`,
                `users`.`last_edit`,
				`users`.`state`			
			FROM `notes`.`users`
			WHERE `users`.`email` = `email`
            AND `users`.`state` > 0;			            
        END;        
	ELSE
		BEGIN
			SELECT				
				`users`.`id_user`,
				`users`.`email`,
				`users`.`name`,
				`users`.`picture`,
                `users`.`last_sign_in`,
                `users`.`creation_date_time`,
                `users`.`last_edit`,
				`users`.`state`			
			FROM `notes`.`users`
			WHERE `users`.`id_user` = `id_user`
            AND `users`.`state` > 0;
		END;
	END IF;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-10-30 16:12:36
