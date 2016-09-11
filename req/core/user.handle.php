<?php 
$result = array("success"=>false,"msg"=>"","data"=>array());
/**
 * 检查用户是否存在
 * @param string $username
 * @return Ambigous <multitype:, multitype:>
 */
function checkUser($username){
	global $result;
	$sql = "select * from user where username='{$username}'";
	return fetchOne($sql);
}
/**
 * 检查用户是否存在
 * @param string $username, string $password
 * @return Ambigous <multitype:, multitype:>
 */
function checkPass($username, $password){
	global $result;
	$sql = "select * from user where username='{$username}' and password='{$password}'";
	return fetchOne($sql);
}
/**
 * 检测是否有用户登录
 * @return string
 */
function checkLogined(){
	global $result;
	if(!isset($_SESSION['userId'])|| $_COOKIE['userId'] == ""){
		$result["msg"] = '请先登录!';
	} else {
		$result["msg"] = "用户已登录!";
		$result["success"] = true;
		$result["data"] = array('username'=>$_SESSION['userName']);
	}
	return $result;
}
/**
 * 用户注册
 * @return json
 */
function signUp(){
	global $result;
	$arr = $_POST;
	$arr["username"] = trim($arr["username"]);
	$arr["password"] = trim($arr["password"]);
	if (!isset($arr["username"]) || empty($arr["username"]) || !isset($arr["password"]) || empty($arr["password"])) {
		$result["msg"] = '用户信息填写不全!';
		return $result;
	}
	if (!preg_match("/^[a-zA-z][a-zA-Z0-9_]{2,9}$/", $arr["username"])) {
		$result["msg"] = "用户名填写不规范！";
		return $result;
	}
	if (!preg_match("/((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{8,16}$/", $arr["password"])) {
		$result["msg"] = "密码填写不规范！";
		return $result;
	}
	$row = checkUser($arr["username"]);
	if ($row) {
		$result["msg"] = '用户已存在!';
		return $result;
	}
	$arr['password'] = md5($_POST['password']);
	if (insert("user", $arr)) {
		$result["msg"] = "注册成功!";
		$result["success"] = true;
		$row = checkUser($arr["username"]);
		$result["data"] = array('username'=>$row['username']);
		setcookie("userId", $row['id'], time()+7*24*3600);
		setcookie("userName", $row['username'], time()+7*24*3600);
		$_SESSION['userId'] = $row['id'];
		$_SESSION['userName'] = $row['username'];
	} else {
		$result["msg"] = "注册失败！";
		$result["success"] = false;
	}
	return $result;
}

/**
 * 注销用户
 * @return json
 */
function signOut(){
	global $result;
	$_SESSION = array();
	if(isset($_COOKIE[session_name()])){
		setcookie(session_name(), "", time()-1);
	}
	if(isset($_COOKIE['userId'])){
		setcookie("userId","",time()-1);
	}
	if(isset($_COOKIE['userName'])){
		setcookie("userName","",time()-1);
	}
	if (session_destroy()){
	    $result["msg"] = "注销成功!";
		$result["success"] = true;
	} else {
		if (session_unset()) {
			$result["msg"] = "注销成功!";
			$result["success"] = true;
		}
		$result["msg"] = "注销失败!";
	}
	return $result;
}

/**
 * 用户登录
 * @return json
 */
function signIn(){
	global $result;
	$arr = $_POST;
	$arr["username"] = trim($arr["username"]);
	$arr["password"] = trim($arr["password"]);
	$arr["verify"] = trim($arr["verify"]);
	$verify1 = $_SESSION['verify'];
	if (!isset($arr["username"]) || empty($arr["username"]) || !isset($arr["password"]) || empty($arr["password"]) || !isset($arr["verify"]) || empty($arr["verify"])) {
		$result["msg"] = '用户信息填写不全!';
		return $result;
	}
	if (!preg_match("/^[a-zA-z][a-zA-Z0-9_]{2,9}$/", $arr["username"])) {
		$result["msg"] = "用户名填写不规范！";
		return $result;
	}
	if (!preg_match("/((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{8,16}$/", $arr["password"])) {
		$result["msg"] = "密码填写不规范！";
		return $result;
	}
	if (strtolower($verify1) != strtolower($arr["verify"])) {
		$result["msg"] = "验证码错误！";
		return $result;
	}
	if (!checkUser($arr["username"])) {
		$result["msg"] = '该用户不存在!';
		return $result;
	}
	$arr['password'] = md5($_POST['password']);
	$row = checkPass($arr["username"], $arr['password']);
	if ($row) {
		$result["msg"] = "登录成功!";
		$result["success"] = true;
		$result["data"] = array('username'=>$row['username']);
		setcookie("userId", $row['id'], time()+7*24*3600);
		setcookie("userName", $row['username'], time()+7*24*3600);
		$_SESSION['userId'] = $row['id'];
		$_SESSION['userName'] = $row['username'];
	} else {
		$result["msg"] = "密码错误，与用户名不匹配!";
		$result["success"] = false;
	}
	return $result;
}