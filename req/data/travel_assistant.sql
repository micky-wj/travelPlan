-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2016-05-05 08:30:29
-- 服务器版本： 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `travel_assistant`
--

-- --------------------------------------------------------

--
-- 表的结构 `plan`
--

CREATE TABLE IF NOT EXISTS `plan` (
  `plan_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '计划id',
  `plan_name` varchar(255) NOT NULL COMMENT '计划名称',
  `user_id` int(10) unsigned NOT NULL COMMENT '用户id',
  `plan_day` int(10) unsigned NOT NULL COMMENT '计划天数',
  `plan_city` varchar(30) NOT NULL COMMENT '计划城市',
  `plan_detail` text COMMENT '计划详情',
  `plan_memo` text COMMENT '计划备注',
  PRIMARY KEY (`plan_id`),
  UNIQUE KEY `plan_name` (`plan_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='行程计划表' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `username` varchar(10) NOT NULL COMMENT '用户名称',
  `password` varchar(32) NOT NULL COMMENT '用户密码',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表' AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
