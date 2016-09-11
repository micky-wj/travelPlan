<?php
require_once 'include.php';
$act = $_REQUEST['action'];
if ($act == "checkLogined") {
	$msg = checkLogined();
} else if ($act == "signIn") {
	$msg = signIn();
} else if ($act == "signOut") {
	$msg = signOut();
} else if ($act == "signUp") {
	$msg = signUp();
} else if ($act == "addPlanBase") {
	$msg = addPlanBase();
} else if ($act == "addPlanSession") {
	$msg = addPlanSession();
} else if ($act == "editPlanName") {
	$msg = editPlanName();
} else if ($act == "editPlanDetail") {
	$msg = editPlanDetail();
} else if ($act == "removePlan") {
	$msg = removePlan();
} else if ($act == "getPlanList") {
	$msg = getPlanList();
} else if ($act == "getPlanDetail") {
	$msg = getPlanDetail();
}
echo json_encode($msg);
?>