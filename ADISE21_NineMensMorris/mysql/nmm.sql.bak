-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 27, 2021 at 05:32 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nmm`
--

DROP PROCEDURE IF EXISTS `move_piece`;
DROP PROCEDURE IF EXISTS `move_piece2`;
DROP PROCEDURE IF EXISTS `reset_board`;
DROP PROCEDURE IF EXISTS `turnupdate`;

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `move_piece` (`x1` TINYINT, `y1` TINYINT)  BEGIN
	declare  p_color char;
	
	select  piece_color into  p_color FROM `board` WHERE X=x1 AND Y=y1;
	
	update game_status set p_turn=if(p_color='W','B','W');
	
    END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `move_piece2` (`x1` TINYINT, `y1` TINYINT, `x2` TINYINT, `y2` TINYINT)  BEGIN
	declare  p_color char;
	
	select  piece_color into p_color FROM `board` WHERE X=x1 AND Y=y1;
	
	update board
	set piece_color=p_color
	where x=x2 and y=y2;
	
	UPDATE board
	SET piece_color=null
	WHERE X=x1 AND Y=y1;
	update game_status set p_turn=if(p_color='W','B','W');
	
    END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `reset_board` ()  BEGIN 
REPLACE INTO board SELECT * FROM boardempty;
update `players` set username=null, token=null, playerNumber=0, counterNumber=9;
update `game_status` set `status`='not active', `p_turn`=null, `result`=null;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `turnupdate` (`x1` CHAR)  BEGIN
	
	update game_status set p_turn=if(x1='W','B','W');
	
    END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `board`
--

DROP TABLE IF EXISTS `board`;

CREATE TABLE `board` (
  `X` tinyint(1) NOT NULL,
  `Y` tinyint(1) NOT NULL,
  `piece_color` enum('W','B') COLLATE utf8_bin DEFAULT NULL,
  `Bcolor` enum('g','r') COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `board`
--

INSERT INTO `board` (`X`, `Y`, `piece_color`, `Bcolor`) VALUES
(1, 1, 'W', 'g'),
(1, 2, NULL, 'r'),
(1, 3, NULL, 'r'),
(1, 4, NULL, 'g'),
(1, 5, NULL, 'r'),
(1, 6, NULL, 'r'),
(1, 7, 'W', 'g'),
(2, 1, NULL, 'r'),
(2, 2, NULL, 'g'),
(2, 3, NULL, 'r'),
(2, 4, NULL, 'g'),
(2, 5, NULL, 'r'),
(2, 6, NULL, 'g'),
(2, 7, NULL, 'r'),
(3, 1, NULL, 'r'),
(3, 2, NULL, 'r'),
(3, 3, NULL, 'g'),
(3, 4, NULL, 'g'),
(3, 5, NULL, 'g'),
(3, 6, NULL, 'r'),
(3, 7, NULL, 'r'),
(4, 1, 'W', 'g'),
(4, 2, NULL, 'g'),
(4, 3, NULL, 'g'),
(4, 4, NULL, 'r'),
(4, 5, NULL, 'g'),
(4, 6, NULL, 'g'),
(4, 7, NULL, 'g'),
(5, 1, NULL, 'r'),
(5, 2, NULL, 'r'),
(5, 3, NULL, 'g'),
(5, 4, NULL, 'g'),
(5, 5, 'B', 'g'),
(5, 6, NULL, 'r'),
(5, 7, NULL, 'r'),
(6, 1, NULL, 'r'),
(6, 2, NULL, 'g'),
(6, 3, NULL, 'r'),
(6, 4, NULL, 'g'),
(6, 5, NULL, 'r'),
(6, 6, NULL, 'g'),
(6, 7, NULL, 'r'),
(7, 1, 'W', 'g'),
(7, 2, NULL, 'r'),
(7, 3, NULL, 'r'),
(7, 4, NULL, 'g'),
(7, 5, NULL, 'r'),
(7, 6, NULL, 'r'),
(7, 7, 'W', 'g');

-- --------------------------------------------------------

--
-- Table structure for table `boardempty`
--

DROP TABLE IF EXISTS `boardempty`;

CREATE TABLE `boardempty` (
  `X` tinyint(1) NOT NULL,
  `Y` tinyint(1) NOT NULL,
  `piece_color` enum('W','B') COLLATE utf8_bin DEFAULT NULL,
  `Bcolor` enum('g','r') COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `boardempty`
--

INSERT INTO `boardempty` (`X`, `Y`, `piece_color`, `Bcolor`) VALUES
(1, 1, NULL, 'g'),
(1, 2, NULL, 'r'),
(1, 3, NULL, 'r'),
(1, 4, NULL, 'g'),
(1, 5, NULL, 'r'),
(1, 6, NULL, 'r'),
(1, 7, NULL, 'g'),
(2, 1, NULL, 'r'),
(2, 2, NULL, 'g'),
(2, 3, NULL, 'r'),
(2, 4, NULL, 'g'),
(2, 5, NULL, 'r'),
(2, 6, NULL, 'g'),
(2, 7, NULL, 'r'),
(3, 1, NULL, 'r'),
(3, 2, NULL, 'r'),
(3, 3, NULL, 'g'),
(3, 4, NULL, 'g'),
(3, 5, NULL, 'g'),
(3, 6, NULL, 'r'),
(3, 7, NULL, 'r'),
(4, 1, NULL, 'g'),
(4, 2, NULL, 'g'),
(4, 3, NULL, 'g'),
(4, 4, NULL, 'r'),
(4, 5, NULL, 'g'),
(4, 6, NULL, 'g'),
(4, 7, NULL, 'g'),
(5, 1, NULL, 'r'),
(5, 2, NULL, 'r'),
(5, 3, NULL, 'g'),
(5, 4, NULL, 'g'),
(5, 5, NULL, 'g'),
(5, 6, NULL, 'r'),
(5, 7, NULL, 'r'),
(6, 1, NULL, 'r'),
(6, 2, NULL, 'g'),
(6, 3, NULL, 'r'),
(6, 4, NULL, 'g'),
(6, 5, NULL, 'r'),
(6, 6, NULL, 'g'),
(6, 7, NULL, 'r'),
(7, 1, NULL, 'g'),
(7, 2, NULL, 'r'),
(7, 3, NULL, 'r'),
(7, 4, NULL, 'g'),
(7, 5, NULL, 'r'),
(7, 6, NULL, 'r'),
(7, 7, NULL, 'g');

-- --------------------------------------------------------

--
-- Table structure for table `game_status`
--
DROP TABLE IF EXISTS `game_status`;

CREATE TABLE `game_status` (
  `status` enum('not_active','initialized','started','ended','aborded') COLLATE utf8_bin NOT NULL DEFAULT 'not_active',
  `p_turn` enum('W','B') COLLATE utf8_bin DEFAULT NULL,
  `result` enum('W','B','D') COLLATE utf8_bin DEFAULT NULL,
  `last_change` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `game_status`
--

INSERT INTO `game_status` (`status`, `p_turn`, `result`, `last_change`) VALUES
('started', 'B', NULL, '2021-12-27 16:31:04');

--
-- Triggers `game_status`
--
DROP TRIGGER IF EXISTS `game_status_update`;

DELIMITER $$
CREATE TRIGGER `game_status_update` BEFORE UPDATE ON `game_status` FOR EACH ROW BEGIN 
  SET NEW.last_change = NOW();
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `players`
--
DROP TABLE IF EXISTS `players`;

CREATE TABLE `players` (
  `username` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `token` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `last_action` timestamp NULL DEFAULT NULL,
  `piece_color` enum('W','B') COLLATE utf8_bin NOT NULL,
  `playerNumber` int(11) DEFAULT NULL,
  `counterNumber` int(11) DEFAULT 9
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `players`
--

INSERT INTO `players` (`username`, `token`, `last_action`, `piece_color`, `playerNumber`, `counterNumber`) VALUES
('DSA', 'aa3989e63d0ae205bde6c2f2757a5b20', NULL, 'W', 9, 9),
('DSA', '8e2cac307a83f170867e1096b507f655', NULL, 'B', 9, 6);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `board`
--
ALTER TABLE `board`
  ADD PRIMARY KEY (`X`,`Y`);

--
-- Indexes for table `boardempty`
--
ALTER TABLE `boardempty`
  ADD PRIMARY KEY (`X`,`Y`);

--
-- Indexes for table `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`piece_color`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
