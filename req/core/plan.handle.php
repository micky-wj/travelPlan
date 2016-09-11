<?php 
$result = array("success"=>false,"msg"=>"","data"=>array());
/**
 * 检查计划名是否存在
 * @param string $userid, string $planname
 * @return Ambigous <multitype:, multitype:>
 */
function checkPlanname($userid, $planname){
	global $result;
	$sql = "select * from plan where user_id='{$userid}'and plan_name='{$planname}'";
	return fetchOne($sql);
}
/**
 * 检查计划ID是否存在
 * @param string $planid
 * @return Ambigous <multitype:, multitype:>
 */
function checkPlanid($planid){
	global $result;
	$sql = "select * from plan where plan_id='{$planid}'";
	return fetchOne($sql);
}
/**
 * 得到所有计划
 * @return json
 */
function getPlanList(){
	global $result;
	$userid = $_SESSION['userId'];
	$sql = "select * from plan where user_id='{$userid}'";
	$rows = fetchAll($sql);
	if ($rows) {
		foreach ($rows as $key => $value) {
			$result["data"][$key] = array('planid' => $value['plan_id'], 'planname' => $value['plan_name'], 'planday' => $value['plan_day'], 'plancity' => $value['plan_city']);
		}
		$result["msg"] = "获取计划列表成功！";
		$result["success"] = true;
	} else {
		$result["msg"] = "获取计划列表失败！";
		$result["success"] = false;
	}
	$result["length"] = count($result["data"]);
	return $result;
}
/**
 * 得到计划详情
 * @return json
 */
function getPlanDetail(){
	global $result;
	$arr = $_POST;
	$planid = isset($arr['planId']) && !empty($arr["planId"])? $arr['planId']:$_SESSION['planId'];
	$sql = "select * from plan where plan_id='{$planid}'";
	$row = fetchOne($sql);
	if ($row) {
		$data = array('planid' => $row['plan_id'], 'planname' => $row['plan_name'], 'planday' => $row['plan_day'], 'plancity' => $row['plan_city'], 'plandetail' => convertStr($row['plan_detail']), 'planmemo' => convertStr($row['plan_memo']));
		$result["data"] = $data;
		$result["msg"] = "获取计划详情成功！";
		$result["success"] = true;
	} else {
		$result["msg"] = "获取计划详情失败！";
		$result["success"] = false;
	}
	return $result;
}
/**
 * 添加计划基本信息
 * @return json
 */
function addPlanBase(){
	global $result;
	$arr = $_POST;
	$arr["user_id"] = $_SESSION['userId'];
	$arr["plan_name"] = trim($arr["plan_name"]);
	$arr["plan_day"] = intval(trim($arr["plan_day"]));
	$arr["plan_city"] = trim($arr["plan_city"]);
	if (!isset($arr["plan_name"]) || empty($arr["plan_name"]) || !isset($arr["plan_day"]) || empty($arr["plan_day"]) || !isset($arr["plan_city"]) || empty($arr["plan_city"])) {
		$result["msg"] = '用户信息填写不全!';
		return $result;
	}
	if (!preg_match("/^[\x{4e00}-\x{9fa5}A-Za-z0-9]{1,20}$/u", $arr["plan_name"])) {
		$result["msg"] = "计划名称填写不规范！";
		return $result;
	}
	if ($arr["plan_day"] > 10 || $arr["plan_day"] <= 0) {
		$result["msg"] = "计划天数超出范围!";
		return $result;
	}
	$row = checkPlanname($arr["user_id"], $arr["plan_name"]);
	if ($row) {
		$result["msg"] = '计划名已存在!';
		return $result;
	}
	$arr['plan_detail'] = array();
	$arr['plan_memo'] = array();
	for ($i = 0; $i < $arr["plan_day"]; $i++) {
		$arr['plan_memo'][$i] = '';
	}
	$arr['plan_detail'] = json_encode($arr['plan_detail']);
	$arr['plan_memo'] = json_encode($arr['plan_memo']);
	if (insert("plan", $arr)) {
		$result["msg"] = "新建成功!";
		$result["success"] = true;
		$row = checkPlanname($arr["user_id"], $arr["plan_name"]);
		setcookie("planId", $row['plan_id'], time()+7*24*3600);
		setcookie("planName", $row['plan_name'], time()+7*24*3600);
		$_SESSION['planId'] = $row['plan_id'];
		$_SESSION['planName'] = $row['plan_name'];
	} else {
		$result["msg"] = "注册失败！";
		$result["success"] = false;
	}
	return $result;
}
/**
 * 修改计划名称
 * @return json
 */
function editPlanName(){
	global $result;
	$arr = $_POST;
	$arr["user_id"] = $_SESSION['userId'];
	$arr["plan_name"] = trim($arr["plan_name"]);
	$checkrow1 = checkPlanid($arr['plan_id']);
	$checkrow2 = checkPlanname($arr["user_id"], $arr["plan_name"]);
	if (!$checkrow1) {
		$result["msg"] = "修改失败，修改的计划不存在!";
		return $result;
	}
	if (!isset($arr["plan_name"]) || empty($arr["plan_name"])) {
		$result["msg"] = '计划名称不能为空!';
		return $result;
	}
	if (!preg_match("/^[\x{4e00}-\x{9fa5}A-Za-z0-9]{1,20}$/u", $arr["plan_name"])) {
		$result["msg"] = "计划名称填写不规范！";
		return $result;
	}
	if ($checkrow2) {
		$result["msg"] = '计划名已存在!';
		return $result;
	}
	$where = "plan_id=".$arr['plan_id'];
	$editinfo = array('plan_name'=>$arr['plan_name']);
	if (update("plan", $editinfo, $where)) {
		$result["msg"] = "修改成功!";
		$result["success"] = true;
	} else {
		$result["msg"] = "修改失败，请重新操作!";
		$result["success"] = false;
	}
	return $result;
}
/**
 * 删除计划
 * @return json
 */
function removePlan(){
	global $result;
	$arr = $_POST;
	$row = checkPlanid($arr['plan_id']);
	if ($row) {
		$where = "plan_id=".$arr['plan_id'];
		if (delete("plan", $where)) {
			$result["msg"] = "删除成功!";
			$result["success"] = true;
		} else {
			$result["msg"] = "删除失败，请重新操作!";
			$result["success"] = false;
		}
	} else {
		$result["msg"] = "删除失败，删除的计划不存在!";
		$result["success"] = false;
	}
	return $result;
}
/**
 * 增加计划session
 * @return json
 */
function addPlanSession(){
	global $result;
	$arr = $_POST;
	$row = checkPlanid($arr['plan_id']);
	if ($row) {
		setcookie("planId", $arr['plan_id'], time()+7*24*3600);
		setcookie("planName", $row['plan_name'], time()+7*24*3600);
		$_SESSION['planId'] = $arr['plan_id'];
		$_SESSION['planName'] = $row['plan_name'];
		$result["msg"] = "存入成功!";
		$result["success"] = true;
	} else {
		$result["msg"] = "该计划不存在!";
		$result["success"] = false;
	}
	return $result;
}
/**
 * 修改计划详情
 * @return json
 */
function editPlanDetail(){
	global $result;
	$arr = $_POST;
	$arr["plan_day"] = trim($arr["plan_day"]);
	$arr["plan_detail"] = json_encode($arr["plan_detail"]);
	$arr["plan_memo"] = json_encode($arr["plan_memo"]);
	$where = "plan_id=".$arr['plan_id'];
	$editinfo = array('plan_day'=>$arr['plan_day'],'plan_detail'=>$arr['plan_detail'],'plan_memo'=>$arr['plan_memo']);
	if (update("plan", $editinfo, $where)) {
		$result["msg"] = "修改成功!";
		$result["success"] = true;
	} else {
		$result["msg"] = "修改失败，请重新操作!";
		$result["success"] = false;
	}
	return $result;
}
