//全局变量
var global = $('body');
var $header = $('.pd-header h1 span')
var $dayList = $(".pd-day-sortable");
var $addDayBtn = $('[data-node="addDay"]');
var $spotList = $(".pd-spot-sortable");
var $optimRouteBtn = $('[data-node="optimRoute"]');
var $eidtMemoBtn = $('[data-node="eidtMemo"]');
var $confirmPlanBtn = $('[data-node="confirmPlan"]');
var $dismissPlanBtn = $('[data-node="dismissPlan"]');
var pinfo = {};
var activeDay = 1;
toastr.options = {
	"closeButton": false,
	"debug": false,
	"positionClass": "toast-top-center",
	"showDuration": "300",
	"hideDuration": "1000",
	"timeOut": "5000",
	"extendedTimeOut": "1000",
	"showEasing": "swing",
	"hideEasing": "linear",
	"showMethod": "fadeIn",
	"hideMethod": "fadeOut"
};
//天列表事件
$dayList.on('click', 'li', function (e) {
	var $target = $(e.currentTarget);
	$dayList.find('.active').removeClass('active');
	$target.addClass('active');
	global.trigger('activeDayChange');
});
$dayList.on('click', 'li button', function (e) {
	e.stopPropagation();
	$('#deleteDayModal').modal('show');
});
$addDayBtn.on('click', function (e) {
	var $target = $(e.currentTarget);
	if (pinfo.detail.length === 10) {
		toastr.warning('不能超过十天');
	} else {
		pinfo.detail.push([]);
		pinfo.memo.push('');
		global.trigger('daylistUpdate');
		$dayList.find('li').eq(-1).click();
	}
});
$('#deleteDayModal').on('show.bs.modal', function () {
	var $modal = $(this);
	$modal.find('h4').html('删除第' + activeDay + '天');
});
$('#deleteDayModal').on('click','[data-node="confirm"]',function (e) {
	e.stopPropagation();
	pinfo.detail.splice(activeDay-1, 1);
	pinfo.memo.splice(activeDay-1, 1);
	$dayList.find('li').eq(0).addClass('active');
	$('#deleteDayModal').modal('hide');
	global.trigger('activeDayChange');
	global.trigger('daylistUpdate');
});

$dayList.sortable({
	placeholder:"ui-state-highlight",
	start: function( event, ui ) {
		ui.item.click();
	},
	stop: function( event, ui ) {
		var changeDetail = pinfo.detail.splice(activeDay-1, 1);
		var changeMemo = pinfo.memo.splice(activeDay-1, 1);
		var newIndex = ui.item.index();
		pinfo.detail.splice(newIndex, 0, changeDetail[0]);
		pinfo.memo.splice(newIndex, 0, changeMemo[0]);
		global.trigger('activeDayChange');
		global.trigger('daylistUpdate');
	}
});
$dayList.disableSelection();
//景点列表事件
$spotList.on('click', 'li button', function (e) {
	e.stopPropagation();
	var $target = $(e.currentTarget);
	var index = $target.parents('li').index();
	var deleteSpot = pinfo.detail[activeDay-1].splice(index, 1);
	global.trigger('spotlistUpdate');
});
$('#optimRouteModal').on('show.bs.modal', function () {
	var $modal = $(this);
	$modal.find('#start').html('');
	var data = pinfo.detail[activeDay-1];
	for(var i = 0; i < data.length; i++) {
		var $option = $('<option></option>');
		$option.attr('value', i);
		$option.html(data[i].name);
		$modal.find('#start').append($option);
	}
});
$('#optimRouteModal').on('shown.bs.modal', function () {
	var $modal = $(this);
		var $error = $modal.find("#errorinfo");
 	$modal.on('click','[data-node="confirm"]',function (e) {
 		e.stopPropagation();
 		var startIndex = getModalParams($modal).start;
 		var oldData = pinfo.detail[activeDay-1];
 		var newData = [];
 		newData.push(oldData[startIndex]);
 		oldData.splice(startIndex,1);
 		while (oldData.length) {
 			var smallindex = 0;
 			var baseData = newData[newData.length-1];
 			var distance = getDistance(baseData, oldData[0]);
 			for(var i = 1; i < oldData.length; i++) {
 				if(getDistance(baseData, oldData[i]) < distance) {
 					smallindex = i;
 					distance = getDistance(baseData, oldData[i]);
 				}
 			}
 			newData.push(oldData[smallindex]);
 			oldData.splice(smallindex, 1);
 		}
 		pinfo.detail[activeDay-1] = newData;
 		$('#optimRouteModal').modal('hide');
 		global.trigger('spotlistUpdate');
 	});
});
$('#eidtMemoModal').on('show.bs.modal', function () {
	var $modal = $(this);
	$modal.find('textarea').val(pinfo.memo[activeDay-1]);
});
$('#eidtMemoModal').on('click','[data-node="confirm"]',function (e) {
	var $modal = $(this);
	pinfo.memo[activeDay-1] = getModalParams($('#eidtMemoModal')).memo;
	$('#eidtMemoModal').modal('hide');
	console.log(pinfo.memo)
});
$spotList.sortable({
	placeholder:"ui-state-highlight",
	start: function( event, ui ) {
		spotOldIndex = ui.item.index();
	},
	stop: function( event, ui ) {
		var changeSpot = pinfo.detail[activeDay-1].splice(spotOldIndex, 1);
		spotNewIndex = ui.item.index();
		pinfo.detail[activeDay-1].splice(spotNewIndex, 0, changeSpot[0]);
		global.trigger('mapUpdate');
	}
});
$spotList.on('dblclick','li',function (e) {
	var $target = $(e.currentTarget);
	var value = $target.html().split('<button')[0];
	var $input = $('<input>');
	$target.html('');
	$input.val(value).appendTo($target).select();
});
$spotList.on('keyup','li>input',function (e) {
	var $target = $(e.currentTarget);
	if (e.keyCode == 13){
		$target.trigger('blur');
	}
});
$spotList.on('blur','li>input',function (e) {
	var $target = $(e.currentTarget);
	var $li = $target.parents('li');
	var value = $target.val();
	var index = $li.index();
	$li.html('').append(value + '<button class="close">&times;</button>');
	pinfo.detail[activeDay-1][index].name = value;
});
$spotList.disableSelection();
$spotList.sortable({placeholder:"ui-state-highlight"});


// 百度地图API功能
function updateMap() {
	var map = new BMap.Map("pd-map");
	map.setMapStyle({style:'bluish'});
	map.addControl(new BMap.MapTypeControl());
	map.enableScrollWheelZoom(true);
	if (pinfo.detail[activeDay-1].length){
		map.centerAndZoom(new BMap.Point(pinfo.detail[activeDay-1][0].lng, pinfo.detail[activeDay-1][0].lat), 15);
		map.setCurrentCity(pinfo.city);
	} else {
		map.centerAndZoom(pinfo.city,14); 
	}
	map.addEventListener("click",function(e){
		getSpotName(e.point.lat, e.point.lng);
	});
	setMapCover(map);
}
function getSpotName(lat, lng) {
	var newSpot = {};
	$.getJSON('http://api.map.baidu.com/geocoder/v2/?ak=9gGujwKanGtwDlr5a4D6OYxoQhOKrdOQ&location='+lat+','+lng+'&output=json&callback=?', function(data) {
		if (data.status == 0) {
			if (data.result.poiRegions.length) {
				var name = data.result.poiRegions[0].name;
			} else {
				var name = data.result['sematic_description'];
			}
			newSpot = {
				'name': name,
				'lat': data.result.location.lat,
				'lng': data.result.location.lng
			}
			console.log(data.result)
			pinfo.detail[activeDay-1].push(newSpot);
			global.trigger('spotlistUpdate');
		}});
}
// 公共函数
function getModalParams (el) {
    var $params = el.find('[data-param]'),
        params = {};
    $params.each(function(idx, item) {
        var $item = $(item),
            k = $item.data('param'),
            v = $item.attr('type') === 'checkbox'
                ? ($item.prop('checked') ? $item.data('value') : '')
                : ($item.data('value') || $item.val());
        params[k] = $.trim(v);
    });
    return params;
}
function getDistance(point1, point2) {
	var distance = Math.pow(Math.abs(point1.lng - point2.lng), 2) + Math.pow(Math.abs(point1.lat - point2.lat), 2);
	return distance;
}
function updateSpotlist() {
	$spotList.siblings('h2').html('Day ' + activeDay)
	var data = pinfo.detail[activeDay-1];
	var liStr = '';
	for(var i = 0; i < data.length; i++) {
		liStr += '<li>' + data[i].name + '<button class="close">&times;</button></li>';
	}
	$spotList.html('');
	$spotList.append(liStr);
}
function updateDaylist() {
	var length = pinfo.memo.length;
	var liStr = '';
	for (var i = 1; i <= length; i++) {
		if (i == activeDay) {
			liStr += '<li class="active">Day ' + i + '<button class="close">&times;</button></li>'
		} else {
			liStr += '<li>Day ' + i + '<button class="close">&times;</button></li>'
		}
	}
	$dayList.html('');
	$dayList.append(liStr);
}
function setMapCover(map) {
	var data = pinfo.detail[activeDay-1];
	var pointArr = [];
	for(var i = 0; i < data.length; i++) {
		pointArr[i] = new BMap.Point(data[i].lng, data[i].lat);
		var marker = new BMap.Marker(pointArr[i]);
		map.addOverlay(marker);
		var label = new BMap.Label(i+1, {offset:new BMap.Size(0,-20)});
		label.setStyle({
			border: 'none',
			background: 'transparent',
			textAlign: 'center',
			color: "#A94442",
			textShadow: '0 0 5px #ED2D2D',
			fontSize: "20px",
			fontWeight: 'bold'
		});
		marker.setLabel(label);
	}
	var polyline = new BMap.Polyline(pointArr, {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5});
	map.addOverlay(polyline);
}
function initData() {
	$.ajax({ 
	    type: "GET", 	
		url: "req/doAction.php",
		data: {
			action: 'getPlanDetail'
		},
		dataType: "json",
		success: function(data) {
			if (data.success) { 
				pinfo.id = data.data["planid"];
				pinfo.detail = data.data["plandetail"];
				pinfo.memo = data.data["planmemo"];
				pinfo.name = data.data["planname"];
				pinfo.city = data.data["plancity"];
				pinfo.day = data.data["planday"];
				if (!pinfo.detail.length) {
					for (var i = 0; i < pinfo.memo.length; i++) {
						pinfo.detail.push([]);
					}
				}
				$header.html('——' + pinfo.name);
				updateDaylist();
				updateSpotlist();
				updateMap();
				// toastr.success(data.msg);
			} else {
				toastr.warning(data.msg);
				setTimeout("window.location.href = 'index.html'",1000);
			}  
		},
		error: function(req){
			toastr.error("发生错误：" + req.status);
			setTimeout("window.location.href = 'index.html'",1000);
		},     
	});
}
//全局事件
$confirmPlanBtn.on('click',function () {
	pinfo.day = pinfo.detail.length;
	$.ajax({ 
	    type: "POST", 	
		url: "req/doAction.php",
		data: {
			action: 'editPlanDetail',
			plan_id: pinfo.id,
			plan_day: pinfo.day,
			plan_detail: pinfo.detail,
			plan_memo: pinfo.memo
		},
		dataType: "json",
		success: function(data) {
			if (data.success) { 
				toastr.success(data.msg);
				setTimeout("window.location.href = 'planlist.html'",1000);
			} else {
				toastr.warning(data.msg);
			}  
		},
		error: function(req){
			toastr.error("发生错误：" + req.status);
		},     
	});
})
$('#dismissPlanModal').on('click','[data-node="confirm"]',function (e) {
	$('#dismissPlanModal').modal('hide');
	setTimeout("window.location.href = 'planlist.html'",500);
});
global.on('activeDayChange',function () {
	activeDay = $dayList.find('.active').index() + 1;
	global.trigger('spotlistUpdate');
});
global.on('daylistUpdate',function () {
	updateDaylist();
});
global.on('spotlistUpdate',function () {
	updateSpotlist();
	global.trigger('mapUpdate');
});
global.on('mapUpdate',function () {
	updateMap();
});
$(document).ready(function () {
	initData();
})