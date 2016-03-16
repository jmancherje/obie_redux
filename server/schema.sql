
DROP DATABASE IF EXISTS bananas;
CREATE DATABASE bananas;

USE bananas;

-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'Users'
--
-- ---

DROP TABLE IF EXISTS `Users`;

CREATE TABLE `Users` (
  `id` INT AUTO_INCREMENT,
  `name` VARCHAR(20) NOT NULL,
  `password` VARCHAR(40),
  `houseId` INT,
  `venmoName` VARCHAR(40),
  `username` VARCHAR(40),
  `email` VARCHAR(100),
  `provider` VARCHAR(100),
  `venmo` VARCHAR(1000),
  `balance` FLOAT,
  `venmoid` VARCHAR(500),
  `userImageUrl` VARCHAR(200),
  `isLandlord` TINYINT DEFAULT 0,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'House'
--
-- ---

DROP TABLE IF EXISTS `House`;

CREATE TABLE `House` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(30) NOT NULL DEFAULT 'NULL',
  `token` VARCHAR(15) NOT NULL,
  `address` VARCHAR(200),
  `landlordId` INT,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Chores'
-- 
-- ---

DROP TABLE IF EXISTS `Chores`;
    
CREATE TABLE `Chores` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT,
  `name` VARCHAR(30) NOT NULL,
  `category` VARCHAR(20) NOT NULL,
  `completed` TINYINT NOT NULL DEFAULT 0,
  `dueDate` DATE NULL,
  `houseId` INT NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Messages'
-- 
-- ---

DROP TABLE IF EXISTS `Messages`;
    
CREATE TABLE `Messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `text` MEDIUMTEXT NOT NULL,
  `houseId` INT NOT NULL,
  `time` DATETIME NOT NULL,
  `landlordChat` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Bill'
-- 
-- ---

DROP TABLE IF EXISTS `Bill`;
    
CREATE TABLE `Bill` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `total` FLOAT NOT NULL,
  `name` VARCHAR(30) NULL,
  `dueDate` DATE NOT NULL,
  `datePaid` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Payment'
-- 
-- ---

DROP TABLE IF EXISTS `Payment`;
    
CREATE TABLE `Payment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `billId` INT NOT NULL,
  `userId` INT NOT NULL,
  `amount` FLOAT NOT NULL,
  `paid` TINYINT NOT NULL DEFAULT 0,
  `datePaid` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `Users` ADD FOREIGN KEY (houseId) REFERENCES `House` (`id`);
ALTER TABLE `House` ADD FOREIGN KEY (landlordId) REFERENCES `Users` (`id`);
ALTER TABLE `Chores` ADD FOREIGN KEY (userId) REFERENCES `Users` (`id`);
ALTER TABLE `Messages` ADD FOREIGN KEY (userId) REFERENCES `Users` (`id`);
ALTER TABLE `Messages` ADD FOREIGN KEY (houseId) REFERENCES `House` (`id`);
ALTER TABLE `Bill` ADD FOREIGN KEY (userId) REFERENCES `Users` (`id`);
ALTER TABLE `Payment` ADD FOREIGN KEY (billId) REFERENCES `Bill` (`id`);
ALTER TABLE `Payment` ADD FOREIGN KEY (userId) REFERENCES `Users` (`id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `Users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `House` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Chores` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Messages` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Bill` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Payment` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

INSERT INTO `House` (`id`,`name`,`token`) VALUES
(1,'Landlord House', 'QWERTY123');

INSERT INTO `House` (`id`,`name`,`token`) VALUES
(2,'less fun house', '12345');

-- INSERT INTO `Users` (`id`,`name`,`password`,`houseId`) VALUES
-- ('','','','');
INSERT INTO `Users` (name, houseId, venmoName, username, email, provider, venmo, balance, venmoid ) VALUES
('Joey Holland', 1,'Joey', 'jballz', 'joey@yahoo.com', 'venmo', '{}', 45.33, 444444 );

INSERT INTO `Users` (name, houseId, venmoName, username, email, provider, venmo, balance, venmoid ) VALUES
('Justin Mancherje', 1,'JMancherje', 'justin', 'justin@yahoo.com', 'venmo', '{}', 45000.33, 444445 );

INSERT INTO `Users` (name, houseId, venmoName, username, email, provider, venmo, balance, venmoid ) VALUES
('Lyly Nguyen', 1,'lnguyen', 'lyly', 'lyly@yahoo.com', 'venmo', '{}', 142.23, 444446 );

INSERT INTO `Users` (name, houseId, venmoName, username, email, provider, venmo, balance, venmoid ) VALUES
('Nick Kneafsey', 1,'nicholas', 'nicky', 'nick@yahoo.com', 'venmo', '{}', 4.33, 444447 );

-- INSERT INTO `Users` (`id`,`name`,`password`,`houseId`) VALUES
-- (2, 'Nick Kneafsey','nice', 1);

-- INSERT INTO `Users` (`id`,`name`,`password`,`houseId`) VALUES
-- (3, 'Lyly Nguyen','password', 2);

-- INSERT INTO `Users` (`id`,`name`,`password`,`houseId`) VALUES
-- (4, 'Justin Mancherje','123', 2);


-- INSERT INTO `House` (`id`,`name`) VALUES
-- ('','');


-- INSERT INTO `Chores` (`id`,`userId`,`name`,`category`,`completed`,`dueDate`,`houseId`) VALUES
-- ('','','','','','','');

INSERT INTO `Chores` (`userId`,`name`,`category`,`completed`,`dueDate`,`houseId`) VALUES
(1,'feed dog','pets',0,'2016-01-29', 1);

-- INSERT INTO `Messages` (`id`,`userId`,`text`,`houseId`) VALUES
-- ('','','','');

INSERT INTO `Messages` (`id`,`userId`,`text`,`houseId`,`time`) VALUES
(1, 1,'helllo',1, NOW());

INSERT INTO `Messages` (`id`,`userId`,`text`,`houseId`,`time`) VALUES
(2, 3,'hey guys',2, NOW());


-- INSERT INTO `Bill` (`id`,`userId`,`total`,`name`,`dueDate`,`datePaid`) VALUES
-- ('','','','','','');
INSERT INTO `Bill` (`id`,`userId`,`total`,`name`,`dueDate`,`datePaid`) VALUES
(1,1,200,'water bill','2016-01-29', null);
-- INSERT INTO `Payment` (`id`,`billId`,`userId`,`amount`,`paid`,`datePaid`) VALUES
-- ('','','','','','');

INSERT INTO `Payment` (`id`,`billId`,`userId`,`amount`,`paid`,`datePaid`) VALUES
(1,1,2,200,0,null);

INSERT INTO `Payment` (`id`,`billId`,`userId`,`amount`,`paid`,`datePaid`) VALUES
(2,1,2,400,1,null);


