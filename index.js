'use strict';
/* ******************************* Global ************************************************** */
var allItems = { };
var countErrors = [0,0];
var countLastErrors = 0;
var countMessageError = 0;
/* *******************************  ************************************ */

/* Динамическая высота container */
window.document.body.style.minHeight= screen.height;
window.document.getElementById("container").style.height = (screen.height-201) + "px";

$(document).ready(function() {
	/* Tabs code */
	var idTabPrev = 'one';
	$(".tabs").hover(function(){
		if(idTabPrev) {
			$('#'+idTabPrev.toUpperCase()).css("z-index", "0");
			$('#'+idTabPrev).css("background","rgba(200,200,200,.7)");
		}
		$('#'+this.id.toUpperCase()).css("z-index","2");
		$('#'+this.id).css("background","#4EC6DE");
	}, function () {
		idTabPrev = this.id;	  
	});
	/* End Tabs code */
	/* ******************************* Задание 3 (Основное) ************************************ */
	$('#btn-get').click(function() {
		if(!$('#list').length) {
			$('#THREE').append('<div id="list"></div>');
			$('#list').addClass('wrap-list');
			$('#THREE').append('<button id="btn-clear">Clear data</button>');
			$('#btn-clear').addClass('buttons');
			$('#btn-clear').click(function() {
			allItems = {};
			$('#list').remove();
			$('#btn-clear').remove();})
		}		
		$.get('http://careers.intspirit.com/endpoint/data_set', function(response) { showList(response); });		
	});
	/* ******************************* Задание 2 *********************************************** */
	$('#get-res-code').click(function() {
		/* ******* Таблица статистики ******** */
		var statWindow = '<div class="wrap-codes" id="codes">\
		<table id="table"><tbody><tr id="head"><td>Success</td><td>Percent error</td><td>Failure</td></tr>\
		<tr id="count"><td id="countS"></td><td id="countP"></td><td id="countF"></td></tr>\
		<tr id="lastError"><td colspan="3" id="last"></td></tr></tbody></table>\
		<div id="b1"></div><div id="b2"></div><div id="b3"></div></div>'
		if(!$('#wrapButton').length) {
			$('#get-res-code').wrap('<div id="wrapButton" class="wrapButton"></div>');
			$('#get-res-code').addClass('new-btn-codes');
			$('#TWO').append(statWindow);
		}
		$.get('http://careers.intspirit.com/endpoint/response_codes', function(response) { showCodes(response); });			
	});
	/* ******************************* Задание 1 *********************************************** */
	$('#btn-post').click(function () {
		if(!$("div").is("#divMessages")) { /* добавление div с первым сообщением */
			$('#input-text').after('<div id="divMessages"></div>');
		}
		if(!$.trim($('#input-text').val())) { /* пустая строка? */
			$('#btn-post').attr('Value', 'Resubmit');
			$('#input-text').val(''); /* на случай строки пробельных символов */
			/* да пустая */
			if(countMessageError>=5) {				
				$('.errors').first().remove(); /* удалить старейшую ошибку */
			}
			$('#divMessages').append('<div class="errors">The field is empty!</div>'); /* добавить ошшибку */
			countMessageError++;
		}
		else {
			var params = {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				"request" : $('#input-text').val()
			}
			var ob = $.post('http://careers.intspirit.com/endpoint/post_response', params, function(response, status, obj) { showMessage(obj) });
		}		
	});
	$("#post-form").on("submit", function (e) {
		e.preventDefault();
		$('#btn-post').click();
	});
	
});
/* ************** 3# *************** */
function showList(obj) {
	var item = obj['item'];
	var type = obj['type'];	
	/* **** Добавление значений в объект **** */ 
	if(!allItems.hasOwnProperty(type)) {		
		allItems[type] = {};
		allItems[type][item] = 1;	
	}
	else {
		if(!allItems[type].hasOwnProperty(item))
		{
			allItems[type][item]=1;
		}
		else {
			allItems[type][item]++;
		}		
	} /* allItems['type']['item'] */
	/* ******* Отображение списка ******* */
	for(var iType in allItems){
		var plurality = '';
		if(!$('#'+iType).length) {
			$('#list').append('<ul class="ul-list" id="'+iType+'">'+iType+'</div>');
		}
		for(var iItems in allItems[iType]) {
			(allItems[iType][iItems]>1 && iItems!='potatoes')?(plurality = 's'):(plurality = '');
			if($('#'+iItems).length) {
				$('#'+iItems).remove();
			}
			$('#'+iType).append('<li class="li-list" id="'+iItems+'">'+allItems[iType][iItems]+"\
			 "+(iItems.charAt(0).toUpperCase()+iItems.substring(1))+plurality+'</li>');
		}
	}	
}
/* *************** 2# ****************** */
function showCodes(obj) {
	var result = obj['result'];
	if(result) {
		countErrors[1]++; /* +1 Success */
		$('#wrapButton').removeClass('red').addClass('green');
		countLastErrors = 0;
	}
	else {
		countErrors[0]++; /* +1 Error */
		$('#wrapButton').removeClass('green').addClass('red');
		countLastErrors++;
	}
	var trues = parseInt(countErrors[1]);
	var errors = parseInt(countErrors[0]);
	$('#countS').html(trues);
	$('#countF').html(errors);
	$('#countP').html(((errors/(trues+errors))*100).toFixed(2) + "%");
	$('#last').html("Ошибок с крайнего успеха - " + countLastErrors);
}
/* *************** 1# ****************** */
function showMessage(obj) {
	if(obj.status===200) { /* удачный запрос */
		$('#input-text').val('');
		$('.errors').remove();
		$('#divMessages').append('<div class="errors" id="successStatus">'+obj.responseText+' Status request: '+obj.status+'</div>');
		$('#btn-post').prop('disabled', true).attr('Value', '3 ...');
		var i = 2;
		var timer = setInterval(function(){ $('#btn-post').attr('Value', i+' ...'); if(!i) {clearInterval(timer)} i--; }, 1000);
		setTimeout(function(){ $('#btn-post').attr('Value', 'Submit').prop('disabled', false); $('#divMessages').remove();}, 3100);
		countMessageError=0;
	}
	else { /* ошибка. передана строка начинающаяся с 'error' */ 
		$('#btn-post').attr('Value', 'Resubmit');
		if(countMessageError>=5) {				
			$('.errors').first().remove(); /* удалить старейшую ошибку */
		}
		$('#divMessages').append('<div class="errors">Error! '+obj.statusText+'! Status request: '+obj.status+'</div>'); /* добавить ошшибку */
		countMessageError++;
	}
	
}