<?php
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Methods:POST,GET');
header('Access-Control-Allow-Credentials:true'); 
header("Content-Type: application/json;charset=utf-8"); 
date_default_timezone_set("PRC");
session_start();
define("ROOT",dirname(__FILE__));
set_include_path(".".PATH_SEPARATOR.ROOT."/libs".PATH_SEPARATOR.ROOT."/core".PATH_SEPARATOR.get_include_path());
require_once 'mysql.func.php';
require_once 'image.func.php';
require_once 'string.func.php';
require_once "config.php";
require_once 'user.handle.php';
require_once 'plan.handle.php';
