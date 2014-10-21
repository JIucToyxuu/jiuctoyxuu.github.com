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
	var idTabPrev = '';
	$(".tabs").hover(function(){
		if(idTabPrev!=='') {
			$('#'+idTabPrev.toUpperCase()).css("z-index", "0");
			$('#'+idTabPrev).css("background","rgba(200,200,200,.7)");
		}
		else {
			$('#one').css("background","rgba(200,200,200,.7)");
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
		callOtherDomain('GET', '/data_set', showList);			
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
		callOtherDomain('GET', '/response_codes', showCodes);			
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
			var result = {};
			var request = new window.XMLHttpRequest();
    		request.open('POST', 'http://careers.intspirit.com/endpoint/post_response', true);
        	request.setRequestHeader('Content-Type', '	application/x-www-form-urlencoded; charset=UTF-8');
    		request.onload = function() { showMessage(request);}
    		request.onerror = function() { alert(request.responseText) }       
    		request.send("request="+$('#input-text').val())
		}		
	});
	
});
/* ************** 3# *************** */
function showList(obj) {
	var string = obj.responseText;
	/* parse in mozilla & opera */
	var ar = {};
	if((typeof InstallTrigger !== undefined && !window.chrome) || !!window.opera) {
		var regExpParse = new RegExp(/\b(?:[\w!]+?(?=<\/))/gi);
		var result = string.match(regExpParse);
		ar['item'] = result[0];
		ar['type'] = result[1];		
	}
	/* parse in other browsers */
	else {
		var ar = $.parseJSON(string);
	}
	/* **** Добавление значений в объект **** */
	if(!allItems.hasOwnProperty(ar['type'])) {		
		allItems[ar['type']] = {};
		allItems[ar['type']][ar['item']] = 1;	
	}
	else {
		if(!allItems[ar['type']].hasOwnProperty(ar['item']))
		{
			allItems[ar['type']][ar['item']]=1;
		}
		else {
			allItems[ar['type']][ar['item']]++;
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
	var string = obj.responseText;
	/* parse in mozilla & opera */
	var ar = {};
	if((typeof InstallTrigger !== undefined && !window.chrome) || !!window.opera) {
		var regExpParse = new RegExp(/\b(?:[\w!]+?(?=<\/))/gi);
		var result = string.match(regExpParse);
		ar['result'] = result[0];
		ar['text'] = result[1];
		
	}
	/* parse in other browsers */
	else {
		var ar = $.parseJSON(string);
	}
	if(ar['result'].toString()=='true') {
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
		$('#divMessages').append('<div class="errors" id="successStatus">'+obj.response+' Status request: '+obj.status+'</div>');
		$('#btn-post').prop('disabled', true).attr('Value', '3 ...');
		var i = 2;
		var timer = setInterval(function(){ $('#btn-post').attr('Value', i+' ...'); i--; if(i==0) {clearInterval(timer)} }, 1000);
		setTimeout(function(){ $('#btn-post').attr('Value', 'Submit').prop('disabled', false); $('#divMessages').remove();}, 3000);
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
/* ***************************************************************************************** */
function callOtherDomain(method, endOfUrl,callbackShow) {
	var url = 'http://careers.intspirit.com/endpoint' + endOfUrl;
	var request = new window.XMLHttpRequest();
	request.open(method, url, true);
	request.onload = function() { 
		callbackShow(request);
		
	}
	request.onerror = function() {
		alert(request.responseText);
	}
	request.send();
}
/* ***************************************************************************************** */
