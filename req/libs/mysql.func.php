<?php 
/**
 * 连接数据库
 * @return resource
 */
function connect(){
	$link = mysqli_connect(DB_HOST,DB_USER,DB_PWD,DB_DBNAME);
	if (mysqli_connect_errno($link))
	{
		echo "数据库连接失败:".mysqli_connect_error();
	}
	mysqli_set_charset($link, "utf8");
	return $link;
}

/**
 * 完成记录插入的操作
 * @param string $table
 * @param array $array
 * @return number
 */
function insert($table, $array){
	$link = connect();
	unset($array['action']);
	$keys = join(",",array_keys($array));
	$vals = "'".join("','",array_values($array))."'";
	$sql = "insert into {$table}({$keys}) values({$vals})";
	mysqli_query($link, $sql);
	return mysqli_insert_id($link);
	mysqli_close($link);
}
/**
 * 记录的更新操作
 * @param string $table
 * @param array $array
 * @param string $where
 * @return number
 */
function update($table, $array, $where = null){
	$link = connect();
	unset($array['action']);
	$str = null;
	foreach($array as $key=>$val){
		if ($str == null) {
			$sep = "";
		} else {
			$sep = ",";
		}
		$str.= $sep.$key."='".$val."'";
	}
	$sql = "update {$table} set {$str} ".($where==null?null:" where ".$where);
	$result = mysqli_query($link, $sql);
	if ($result) {
		return mysqli_affected_rows($link);
	} else {
		return false;
	}
	mysqli_close($link);
}

/**
 *	删除记录
 * @param string $table
 * @param string $where
 * @return number
 */
function delete($table, $where=null){
	$link = connect();
	$where = $where == null? null : " where ".$where;
	$sql = "delete from {$table} {$where}";
	mysqli_query($link, $sql);
	return mysqli_affected_rows($link);
	mysqli_close($link);
}

/**
 *得到指定一条记录
 * @param string $sql
 * @param string $result_type
 * @return multitype:
 */
function fetchOne($sql, $result_type=MYSQLI_ASSOC){
	$link = connect();
	$result = mysqli_query($link, $sql);
	$row = mysqli_fetch_array($result, $result_type);
	return $row;
	mysqli_close($link);
}


/**
 * 得到结果集中所有记录 ...
 * @param string $sql
 * @param string $result_type
 * @return multitype:
 */
function fetchAll($sql, $result_type = MYSQLI_ASSOC){
	$link = connect();
	$result = mysqli_query($link, $sql);
	$i = 0;
	$rows = array();
	while($row = mysqli_fetch_array($result, $result_type)){
		$rows[$i] = $row;
		$i++;
	}
	return $rows;
	mysqli_close($link);
}

/**
 * 得到结果集中的记录条数
 * @param unknown_type $sql
 * @return number
 */
function getResultNum($sql){
	$link = connect();
	$result=mysqli_query($link, $sql);
	return mysqli_num_rows($result);
	mysqli_close($link);
}

/**
 * 得到上一步插入记录的ID号
 * @return number
 */
function getInsertId(){
	$link = connect();
	return mysqli_insert_id($link);
	mysqli_close($link);
}
