'use strict';
/* ******************************* Global ************************************************** */
var allItems = { };
var countErrors = [0,0];
var countLastErrors = 0;
/* *******************************  ************************************ */

/* Динамическая высота container */
window.document.body.style.minHeight= screen.height;
window.document.getElementById("container").style.height = (screen.height-200) + "px";

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
});
/* ************** 3# *************** */
function showList(string) {
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
	console.log(allItems);
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
function showCodes(string) {
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
		$('#wrapButton').removeClass('red-btn').addClass('green-btn');
		countLastErrors = 0;
	}
	else {
		countErrors[0]++; /* +1 Error */
		$('#wrapButton').removeClass('green-btn').addClass('red-btn');
		countLastErrors++;
	}
	console.log(countErrors);
	var trues = parseInt(countErrors[1]);
	var errors = parseInt(countErrors[0]);
	$('#countS').empty().append(trues);
	$('#countF').empty().append(errors);
	$('#countP').empty().append(((errors/(trues+errors))*100).toFixed(2) + "%");
	$('#last').empty().append("Ошибок с крайнего успеха - " + countLastErrors);
	
	
	
}	
/* ***************************************************************************************** */
function callOtherDomain(method, endOfUrl,callbackShow) {
	var url = 'http://careers.intspirit.com/endpoint' + endOfUrl;
	var request = new window.XMLHttpRequest();
	request.open(method, url, true);
	request.onload = function() { 
		callbackShow(request.responseText);
		
	}
	request.onerror = function() {
		alert(request.responseText);
	}
	request.send();
}
/* ***************************************************************************************** */
