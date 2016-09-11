<?php 
/**
 * 生成验证码
 * @param int $type
 * @param int $length
 * @return string
 */
function buildRandomString($type=1,$length=4){
	if ($type == 1) {
		$chars = join ( "", range ( 0, 9 ) );
	} elseif ($type == 2) {
		$chars = join ( "", array_merge ( range ( "a", "z" ), range ( "A", "Z" ) ) );
	} elseif ($type == 3) {
		$chars = join ( "", array_merge ( range ( "a", "z" ), range ( "A", "Z" ), range ( 0, 9 ) ) );
	}
	if ($length > strlen ( $chars )) {
		exit ( "字符串长度不够" );
	}
	$chars = str_shuffle ( $chars );
	return substr ( $chars, 0, $length );
}

/**
 * 生成唯一字符串
 * @return string
 */
function getUniName(){
	return md5(uniqid(microtime(true),true));
}

/**
 * 将unicode转换为中文字符
 * @param string $str
 * @return string
 */
function convertStr($str){
	return json_decode(preg_replace_callback("/u([0-9a-f]{4})/", function($match){return '\u'.$match[1];}, $str));
}
