(function(){
	var global = $('body');
	var $signName = $('#signName');
	var $myPlanBtn = $('#myPlanBtn');
	var $signOutBtn = $('#signOutBtn');
	var $brand = $('.masthead-brand');
	var $planTable = $('#planlistTable');
	var $planNone = $('.planlist-none');
	var loginStatus = false;
	var planid = '';

	var province = ['北京','天津','上海','重庆','河北','山西','辽宁','吉林','黑龙江','江苏','浙江','安徽','福建','江西','山东','河南','湖北','湖南','广东','海南','四川','贵州','云南','陕西','甘肃','青海','内蒙古','广西','西藏','宁夏','新疆','香港','澳门','台湾'];
	var city = {北京:['北京市'],天津:['天津市'],上海:['上海市'],重庆:['重庆市'],河北:['石家庄','唐山','秦皇岛','邯郸','邢台','保定','张家口','承德','沧州','廊坊','衡水'],山西:['太原','大同','阳泉','长治','晋城','朔州','晋中','运城','忻州','临汾','吕梁'],辽宁:['沈阳','大连','鞍山','抚顺','本溪','丹东','锦州','营口','阜新','辽阳','盘锦','铁岭','朝阳','葫芦岛'],吉林:['长春','吉林','四平','辽源','通化','白山','松原','白城','延边朝鲜族自治州'],黑龙江:['哈尔滨','齐齐哈尔','鹤岗','双鸭山','鸡西','大庆','伊春','牡丹江','佳木斯','七台河','黑河','绥化','大兴安岭'],江苏:['南京','苏州','无锡','常州','镇江','南通','泰州','扬州','盐城','连云港','徐州','淮安','宿迁'],浙江:['杭州','宁波','温州','嘉兴','湖州','绍兴','金华','衢州','舟山','台州','丽水'],安徽:['合肥','芜湖','蚌埠','淮南','马鞍山','淮北','铜陵','安庆','黄山','滁州','阜阳','宿州','巢湖','六安','亳州','池州','宣城'],福建:['福州','厦门','莆田','三明','泉州','漳州','南平','龙岩','宁德'],江西:['南昌','景德镇','萍乡','九江','新余','鹰潭','赣州','吉安','宜春','抚州','上饶'],山东:['济南','青岛','淄博','枣庄','东营','烟台','潍坊','济宁','泰安','威海','日照','莱芜','临沂','德州','聊城','滨州','菏泽'],河南:['郑州','开封','洛阳','平顶山','安阳','鹤壁','新乡','焦作','濮阳','许昌','漯河','三门峡','南阳','商丘','信阳','周口','驻马店'],湖北:['武汉','黄石','十堰','荆州','宜昌','襄樊','鄂州','荆门','孝感','黄冈','咸宁','随州','恩施'],湖南:['长沙','株洲','湘潭','衡阳','邵阳','岳阳','常德','张家界','益阳','郴州','永州','怀化','娄底','湘西'],广东:['广州','深圳','珠海','汕头','韶关','佛山','江门','湛江','茂名','肇庆','惠州','梅州','汕尾','河源','阳江','清远','东莞','中山','潮州','揭阳','云浮'],海南:['海口','三亚'],四川:['成都','自贡','攀枝花','泸州','德阳','绵阳','广元','遂宁','内江','乐山','南充','眉山','宜宾','广安','达州','雅安','巴中','资阳','阿坝','甘孜','凉山'],贵州:['贵阳','六盘水','遵义','安顺','铜仁','毕节','黔西南','黔东南','黔南'],云南:['昆明','曲靖','玉溪','保山','昭通','丽江','普洱','临沧','德宏','怒江','迪庆','大理','楚雄','红河','文山','西双版纳'],陕西:['西安','铜川','宝鸡','咸阳','渭南','延安','汉中','榆林','安康','商洛'],甘肃:['兰州','嘉峪关','金昌','白银','天水','武威','酒泉','张掖','庆阳','平凉','定西','陇南','临夏','甘南'],青海:['西宁','海东','海北','海南','黄南','果洛','玉树','海西'],内蒙古:['呼和浩特','包头','乌海','赤峰','通辽','鄂尔多斯','呼伦贝尔','巴彦淖尔','乌兰察布','锡林郭勒盟','兴安盟','阿拉善盟'],广西:['南宁','柳州','桂林','梧州','北海','防城港','钦州','贵港','玉林','百色','贺州','河池','来宾','崇左'],西藏:['拉萨','那曲','昌都','林芝','山南','日喀则','阿里'],宁夏:['银川','石嘴山','吴忠','固原','中卫'],新疆维吾尔自治区:['乌鲁木齐','克拉玛依','吐鲁番','哈密','和田','阿克苏','喀什','克孜勒苏','巴音郭楞','昌吉','博尔塔拉','伊犁','塔城','阿勒泰'],香港:['香港岛','九龙东','九龙西','新界东','新界西'],澳门:['澳门半岛','离岛'],台湾:['台北','高雄','基隆','新竹','台中','嘉义','台南市']};

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

	global.tooltip({
      track: true
    });
    checkLogined();
    getPlanList();
    $brand.on('click', function (e) {
    	window.location.href = "index.html";
    });
    $planTable.on('click', 'a', function (e) {
    	var $target = $(e.currentTarget);
    	planid = $target.data('planid');
    });
    $planTable.on('click', '[data-node="editPlan"]', function (e) {
    	$.ajax({ 
    	    type: "POST",
    		url: "req/doAction.php",
    		data: {
    			action: 'addPlanSession',
    			plan_id: planid
    		},
    		dataType: "json",
    		success: function(data) {
    			if (data.success) {
    				window.location.href = "plandetail.html";
    			} else {
    				toastr.warning(data.msg);
    			}
    		},
    		error: function(req){
    			toastr.error("发生错误：" + req.status);
    		}
    	});
    });
    $('.modal').on('show.bs.modal', function () {
		var $modal = $(this);
		var $error = $modal.find("#errorinfo");
		$modal.find('input').val('');
		$error.html('');
	});
	$('.modal').on('shown.bs.modal', function () {
		var $modal = $(this);
		var $error = $modal.find("#errorinfo");
		$modal.find('input').val('');
		$error.html('');
		$modal.on('keyup','input',function (e) {
			$error.html('');
	 	});
	 	$modal.on('change','select',function (e) {
			$error.html('');
	 	})
	});
	$('#getPlanModal').on('show.bs.modal', function () {
		var $modal = $(this);
	 	$.ajax({ 
	 	    type: "GET", 	
	 		url: "req/doAction.php",
	 		data: {
	 			action: 'getPlanDetail',
	 			planId: planid
	 		},
	 		dataType: "json",
	 		success: function(data) {
	 			if (data.success) {
	 				var $container = $modal.find('.modal-body');
	 				var $panel = $container.find('.panel').eq(0).clone();
	 				var day = data.data.planday - 0;
	 				var detailArr = [];
	 				var memoArr = data.data.planmemo;
	 				$container.html('');
	 				if (!data.data.plandetail) {
						for (var num = 0; num < day; num++) {
							detailArr.push([]);
						}
					} else{
						detailArr = data.data.plandetail;
					}
	 				for (var i = 0; i < day; i++) {
	 					var detail = [];
	 					if(detailArr[i]) {
	 						for (var j = 0; j < detailArr[i].length; j++) {
		 						detail.push(detailArr[i][j].name);
		 					}
		 					$panel.find('dl dd').eq(0).html(detail.join('，'));	
	 					} else {
	 						$panel.find('dl dd').eq(0).html('无');
	 					}
	 					if (memoArr[i]) {
	 						$panel.find('dl dd').eq(1).html(memoArr[i]);
	 					} else {
	 						$panel.find('dl dd').eq(1).html('无');
	 					}
	 					$panel.find('.panel-heading span').html(i+1);
	 					$container.append($panel.clone());
	 				}
	 			} else {
	 				toastr.warning(data.msg);
	 			}  
	 		},
	 		error: function(req){
	 			toastr.error("发生错误：" + req.status);
	 		},     
	 	});
	});
	$('#editPlannameModal').on('shown.bs.modal', function () {
		var $modal = $(this);
		var $error = $modal.find("#errorinfo");

	 	$modal.on('click','[data-node="confirm"]',function (e) {
	 		e.stopPropagation();
	 		var params = getModalParams($modal);
	 		if (params["planname"] === '') {
	 			$error.html('计划名称不能为空!');
	 			return;
	 		}
	 		if (!params["planname"].match(/^[\u4E00-\u9FA5A-Za-z0-9]{1,20}$/)) {
	 			$error.html('计划名称不能含特殊字符，且不能超过20位!');
	 			return;
	 		}
	 		$.ajax({ 
	 		    type: "POST", 	
	 			url: "req/doAction.php",
	 			data: {
	 				action: 'editPlanName',
	 				plan_name: params['planname'],
	 				plan_id: planid
	 			},
	 			dataType: "json",
	 			success: function(data) {
	 				if (data.success) { 
	 					$modal.modal('hide');
	 					global.trigger('tableUpdate');
	 					toastr.success(data.msg);
	 				} else {
	 					toastr.warning(data.msg);
	 				}  
	 			},
	 			error: function(req){
	 				toastr.error("发生错误：" + req.status); 
	 			},     
	 		});
	 	});
	});
	$('#removePlanModal').on('shown.bs.modal', function () {
		var $modal = $(this);
		$modal.on('click','[data-node="confirm"]',function (e) {
			e.stopPropagation();
			$.ajax({ 
			    type: "POST", 	
				url: "req/doAction.php",
				data: {
					'action':'removePlan',
	 				'plan_id': planid
				},
				dataType: "json",
				success: function(data) {
					if (data.success) { 
						$modal.modal('hide');
						global.trigger('tableUpdate');
						toastr.success(data.msg);
					} else {
						$modal.modal('hide');
						toastr.warning(data.msg);
					}
				},
				error: function(req){
					toastr.error("发生错误：" + req.status); 
				},     
			});
		})
	});
	$('#creatBaseModal').on('show.bs.modal', function () {
		var $modal = $(this);
		for(var i = 0; i < province.length; i++) {
			var $option = $('<option></option>');
			$option.attr('value', province[i]);
			$option.html(province[i]);
			$modal.find('#planpro').append($option);
		}
		var cities = city[$modal.find('#planpro').val()];
		$modal.find('#plancity').empty();
		for(var i = 0; i < cities.length; i++){
			var $option = $('<option></option>');
			$option.attr('value', cities[i]);
			$option.text(cities[i]);
			$modal.find('#plancity').append($option);
		}
	});
	$('#creatBaseModal').on('shown.bs.modal', function () {
		var $modal = $(this);
 		var $error = $modal.find("#errorinfo");
		if (!loginStatus){
			$modal.modal('hide');
			toastr.warning('请先登录！');
		}
		$modal.on('keypress', '[type="number"]', function(e) {
			var key = e.which || e.keyCode;
			if(key == 46) {
				e.preventDefault();
			}
		});
		$modal.on('click', '#planpro', function(e) {
	 		var $target = $(e.currentTarget);
			var cities = city[$target.val()];
			$modal.find('#plancity').empty();
			for(var i = 0; i < cities.length; i++){
				var $option = $('<option></option>');
				$option.attr('value', cities[i]);
				$option.text(cities[i]);
				$modal.find('#plancity').append($option);
			}
		});
	 	$modal.on('click','[data-node="confirm"]',function (e) {
	 		e.stopPropagation();
	 		var params = getModalParams($modal);
	 		params["planday"] = parseInt(params["planday"]);
	 		if (params["planname"] === '' || params["planday"] === '') {
	 			$error.html('用户信息填写不全!');
	 			return;
	 		}
	 		if (!params["planname"].match(/^[\u4E00-\u9FA5A-Za-z0-9]{1,20}$/)) {
	 			$error.html('计划名称不能含特殊字符，且不能超过20位!');
	 			return;
	 		}
	 		if (params["planday"] > 10 || params["planday"] <= 0){
	 			$error.html('计划天数超出范围!');
	 			return;
	 		}
	 		$.ajax({ 
	 		    type: "POST", 	
	 			url: "req/doAction.php",
	 			data: {
	 				action: 'addPlanBase',
	 				plan_name: params['planname'],
	 				plan_day: params['planday'],
	 				plan_city: params['plancity']
	 			},
	 			dataType: "json",
	 			success: function(data) {
	 				if (data.success) { 
	 					$modal.modal('hide');
	 					toastr.success(data.msg);
						setTimeout("window.location.href = 'plandetail.html'",500);
	 				} else {
	 					toastr.warning(data.msg);
	 				}  
	 			},
	 			error: function(req){
	 				toastr.error("发生错误：" + req.status); 
	 			},     
	 		});
	 	});
	});
	$('#signOutModal').on('shown.bs.modal', function () {
		var $modal = $(this);
		$modal.on('click','[data-node="confirm"]',function (e) {
			e.stopPropagation();
			$.ajax({ 
			    type: "POST", 	
				url: "req/doAction.php",
				data: {
					action: 'signOut'
				},
				dataType: "json",
				success: function(data) {
					if (data.success) { 
						$modal.modal('hide');
						toastr.success(data.msg);
						setTimeout("window.location.href = 'index.html'",1000);
					} else {
						$modal.modal('hide');
						toastr.warning(data.msg);
					}
				},
				error: function(req){
					toastr.error("发生错误：" + req.status); 
				},     
			});
		})
	});
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
    function checkLogined(){
    	$.ajax({ 
    	    type: "POST",
    		url: "req/doAction.php",
    		data: {
    			action: 'checkLogined'
    		},
    		dataType: "json",
    		success: function(data) {
    			if (data.success) {
    				loginStatus = true;
    				$signName.html(data.data.username);
    			} else {
    				toastr.warning(data.msg);
    				setTimeout("window.location.href = 'index.html'",1000);
    			}
    		},
    		error: function(req){
    			toastr.error(data.msg);
    			setTimeout("window.location.href = 'index.html'",1000);
    		}
    	});
    }
    function getPlanList() {
    	$.ajax({ 
    	    type: "POST", 	
    		url: "req/doAction.php",
    		data: {
    			action: 'getPlanList'
    		},
    		dataType: "json",
    		success: function(data) {
    			if (data.length) { 
    				$planTable.show();
    				$planNone.hide();
    				initPlanTable(data);
    			} else {
    				$planTable.hide();
    				$planNone.show();
    			}
    		},
    		error: function(req){
    			toastr.error("发生错误：" + req.status); 
    		},     
    	});
    }
    function initPlanTable(data) {
    	$planTable.html('');
    	var tableData = data.data;
    	for (var i = 0; i < tableData.length; i++) {
    		var $plan = $('<div class="plan"></div>');
    		$plan.append('<td>' + (i+1) +'</td>')
    			.append('<div class="name">' + tableData[i]['planname'] +'</div>')
    			.append('<div class="day">' + tableData[i]['planday'] +'days</div>')
    			.append('<div class="city">' + tableData[i]['plancity'] +'</div>')
    			.append('<a class="btn" data-toggle="modal" data-target="#getPlanModal" data-node="getPlan" data-planid="' + tableData[i]['planid'] +'">查看计划</a>')
    			.append('<a class="btn" data-toggle="modal" data-target="#editPlannameModal" data-node="editPlanname" data-planid="' + tableData[i]['planid'] +'">修改名称</a>')
    			.append('<a class="btn" data-node="editPlan" data-planid="' + tableData[i]['planid'] +'">修改行程</a>')
    			.append('<a class="btn" data-toggle="modal" data-target="#removePlanModal" data-node="removePlan" data-planid="' + tableData[i]['planid'] +'">删除计划</a>');
    		$planTable.append($plan);
    	}
    }
    global.on('tableUpdate',function () {
    	getPlanList();
    });
    global.on('loginOut',function () {
    	loginStatus = false; 
    	$signInBtn.show();
    	$signUpBtn.show();
    	$signName.hide();
    	$myPlanBtn.hide();
    	$signOutBtn.hide();
    });
})();