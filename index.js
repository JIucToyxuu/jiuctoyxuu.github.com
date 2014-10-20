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
			$('#THREE').append('<div id="list">ololo</div>');
			$('#list').addClass('wrap-list');
			$('#THREE').append('<button id="btn-clear">Clear data</button>');
			$('#btn-clear').addClass('buttons');
			$('#btn-clear').click(function() {
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
	
	
	
	/*else {
		countErrors[0]++; 
		$('#wrapButton').removeClass('green-btn').addClass('red-btn');
		countLastErrors++;
	}
	console.log(countErrors);
	var trues = parseInt(countErrors[1]);
	var errors = parseInt(countErrors[0]);
	$('#countS').empty().append(trues);
	$('#countF').empty().append(errors);
	$('#countP').empty().append(((errors/(trues+errors))*100).toFixed(2) + "%");
	$('#last').empty().append("Ошибок с крайнего успеха - " + countLastErrors);*/
	
	console.log(ar);
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
	console.log(ar);
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
var items = [[],[]]; 
var types = [];
var out = [[],[]]; 
var str = "";
var errors = []; /* errors[1] = false; errors[0] = success; */
errors[0] = 0;
errors[1] = 0;
var countLastErrors = 0;
/* функция посылающая кросс-доменный запрос */
/*function callOtherDomain(method, endOfUrl, arrayReplace, callbackParse, callbackShow) {
	var url = "http://careers.intspirit.com/endpoint" + endOfUrl;
	var request = new window.XMLHttpRequest();
	request.open(method, url, true);
	request.onload = function() {
		str = request.response; 
		str = str.replace(arrayReplace[0], ' ');
		str = str.replace(arrayReplace[1], ' ');
		str = str.replace(/"/g, ' ');
		callbackParse(str);
		callbackShow();	
	}
	request.onerror = function() { alert(request.response) }
	request.send();		
}*/
/* Парсинг request.responseText */
function parseRequest(string) {
	if((typeof InstallTrigger !== undefined && !window.chrome) || !!window.opera) {
		var regExpParse = new RegExp(/\b(?:[\w!]+?(?=<\/))/gi);
	}
	else {
		var regExpParse = new RegExp(/\b\w+?\b/gi);
	}
	
	var ar = string.match(regExpParse); /* ar[0]=item; ar[1]=type */
	if(types.length===0) { /* Если массив с типами пуст инициализируем новый массив элементов */
		types.push(ar[1]);
		items[0][0]=ar[0];
	}
	else {
		for(var i=0; i<types.length; i++) { /*если такой тип есть то сохранить в items */
		if(types[i]==ar[1]) {
			if(items[i]!==undefined) {
				items[i].push(ar[0]);
				break;
			}
			else {
				items[i][0] = ar[0];
				break;
			}
		}
		else { /* если такого типа еще нет, то добавить его */
			if(inArr(ar[1], types)) {
				types.push(ar[1]);
				if(items[types.length-1]!==undefined) {
					items[types.length-1].push(ar[0]);
					break;
					}
				else { /* бессмысленно (на всякий случай)*/
					items[types.length-1][0] = ar[0];
					break;
					}
			}			
		}
	}
	}
	/* Test messages */	
	console.log("types");
	console.log(types);
	console.log("items");
	console.log(items);
}
/* Динамическое создание div элемента и кнопки  ****************************************************************************************/
function createList(){
	if((document.getElementById('list'))===null) {
		var THREE = document.getElementById('THREE');
		var wrapList = document.createElement('DIV');
		wrapList.className = "wrap-list";
		wrapList.id = "list";
		THREE.appendChild(wrapList);
		var clearButton = document.createElement('BUTTON');
		clearButton.className = "buttons btn-clear";
		clearButton.innerText = "Clear data";
		clearButton.onclick = function() {			
			items = [[],[]]; 
			types = [];
			out = [[],[]];
			var parent = document.getElementById('THREE');
			var deleteDiv = document.getElementById('list');
			parent.removeChild(deleteDiv);
			parent.removeChild(this);
		}
		THREE.appendChild(clearButton);
	}
		var arrayResponse = ['type', 'item'];
		setTimeout(callOtherDomain('GET', '/data_set', arrayResponse, parseRequest, showList), 100);
}
/* Вспомогательная функция для проверки наличия str в массиве arr */
function inArr(str, arr) {
	var boolVar = true;          
	for(var e in arr){ 
		if(str==arr[e]) { boolVar = false; break;}	        
	}	                
	return boolVar;
}
/* Вывод списка в list */
/*function showList(){
	out = ololo(items);
	for(var i=0; i<types.length; i++) { 
		if((window.document.getElementById(types[i]))===null && types[i]!==undefined) {
			var newUl = document.createElement('UL'); 
			newUl.className = "ul-list";
			newUl.innerHTML = types[i];
			newUl.id = types[i];
			window.document.getElementById('list').appendChild(newUl);
			updateElements(i);
		}
		else {
			updateElements(i);
		}
	}
}*/
function updateElements(i) {
	for(var key in out[i]) {
		var element = window.document.getElementById(key); 
		var parentElement = window.document.getElementById(types[i]);
			if(element!==null) { parentElement.removeChild(element); }
			addElement(i, key,parentElement);
	}
}
function addElement(i, key, parentElement) {
	var newLi = document.createElement('LI');
	newLi.className = "li-list";
	var firstLetter = key.charAt(0).toUpperCase();
	var otherLetters = key.replace(key.charAt(0), '');
	newLi.innerHTML = out[i][key] + " " + firstLetter + otherLetters;
	newLi.id = key;
	if(key!='potatoes' && out[i][key]>1) {
		newLi.innerHTML =  out[i][key] + " " + firstLetter + otherLetters + "s";
	}
	parentElement.appendChild(newLi);
}
function ololo(ar) {
    var countItems =[[],[]];
    for(var i=0; i<ar.length; i++) { /* перебор типов */
    	for(var j=0; j<ar[i].length; j++) { /* перебор предметов */   		
    		if(keyInArr(ar[i][j], countItems[i])) { 
           		countItems[i][ar[i][j]]++;
        	}
        	else { countItems[i][ar[i][j]]=1; }
    	}        	
    }
console.log("result");    
console.log(countItems);
return countItems;
}
/* функция длины ассоциативного массива */
function lengthAA(arr) {
    var count = 0;
    for(a in arr) { count++; }
    return count;
}
/* проверка наличия ключа в массиве */
function keyInArr(str, arr){
	var boolValue = false;
	for(var key in arr) {
		if(key == str) { boolValue=true; }
	}
	return boolValue;
}
/* ****************************** Задание 2 ********************************** */
/*function getResponseCode(idThis) {
	var parent = document.getElementById('TWO');
	if((document.getElementById('wrapButton'))===null) {
		parent.removeChild(document.getElementById(idThis)); 
		var wrapDiv = document.createElement('DIV');
		wrapDiv.id = "wrapButton";
		wrapDiv.className = "wrapButton";
		parent.appendChild(wrapDiv); 
		var parent2 = document.getElementById(wrapDiv.id);
		var newButton = document.createElement('BUTTON');
		newButton.className = "buttons new-btn-codes";
		newButton.id = "get-res-code";
		newButton.innerText = "Get response codes";
		newButton.onclick = function onclick(event) { getResponseCode('get-res-code'); }		
		parent2.appendChild(newButton); 
	}	
	if((document.getElementById('codes'))===null) { 
		var codesDiv = document.createElement('DIV');
		codesDiv.className = "wrap-codes";
		codesDiv.id = "codes";
		parent.appendChild(codesDiv);
		var arrayResponse = ['result', 'text'];
		callOtherDomain('GET', '/response_codes', arrayResponse, parseResponseCode, showResponseCodes);
	}
	else {
		var arrayResponse = ['result', 'text'];
		setTimeout(callOtherDomain('GET', '/response_codes', arrayResponse, parseResponseCode, showResponseCodes), 100);
	}
}
function showResponseCodes() { 
	if((document.getElementById('table'))===null) { 
		parent = document.getElementById('codes');
		var codesTable = document.createElement('TABLE');
		codesTable.id = "table";
		codesTable.innerHTML = '<tr id="head"><td>Success</td><td>Percent error</td><td>Failure</td></tr>' + 
		'<tr id="count"><td id="countS"></td><td id="countP"></td><td id="countF"></td></tr>' + 
		'<tr id="lastError"><td colspan="3" id="last"></td></tr>';
		parent.appendChild(codesTable);
		var B1 = document.createElement('DIV');
		B1.id = "b1";
		document.getElementById('codes').appendChild(B1);
		var B2 = document.createElement('DIV');
		B2.id = "b2";
		document.getElementById('codes').appendChild(B2);
		var B3 = document.createElement('DIV');
		B3.id = "b3";
		document.getElementById('codes').appendChild(B3);
	}
	document.getElementById('countS').innerHTML = errors[0];
	document.getElementById('countF').innerHTML = errors[1];
	document.getElementById('countP').innerHTML = ((errors[1]/(errors[0]+errors[1]))*100).toFixed(2) + "%";
	document.getElementById('last').innerHTML = "Ошибок с крайнего успеха - " + countLastErrors;
}
function parseResponseCode(string) {
	if((typeof InstallTrigger !== undefined && !window.chrome) || !!window.opera) {
		var regExpParse = new RegExp(/\b(?:[\w!]+?(?=<\/))/gi);
	}
	else {
		var regExpParse = new RegExp(/\b\w+?\b/gi);
	}
	var ar = string.match(regExpParse); /* ar[0]=result; ar[1]=text 
	if(ar[0]=="true") { 
		changeColorButton('greenButton');
		errors[0]++;
		countLastErrors=0;
	}
	else {
		changeColorButton('redButton');
		errors[1]++;
		countLastErrors++;
	}
}
function changeColorButton(id) {
	if(document.getElementById(id)===null) {
		var style = document.createElement('style');
		style.type = 'text/css';
		style.id = id;
		if(id == 'redButton') {
			style.innerHTML = '.red-btn { background: rgba(254, 0, 0, 0.7); }';
			if(document.getElementById('greenButton')!==null){
				var p = document.getElementsByTagName('head')[0];
				document.getElementsByTagName('head')[0].removeChild(document.getElementById('greenButton'));
				document.getElementById('wrapButton').className += " red-btn";
			}
		}
		if(id == 'greenButton') {
			style.innerHTML = '.green-btn { background: rgba(0, 254, 0, 0.7); }';
			if(document.getElementById('redButton')!==null){
				document.getElementsByTagName('head')[0].removeChild(document.getElementById('redButton'));
				document.getElementById('wrapButton').className += " green-btn";
			}
		}	
		document.getElementsByTagName('head')[0].appendChild(style);
	}
	if(id == 'greenButton') {
		document.getElementById('wrapButton').className += " green-btn";
	}
	if(id == 'redButton') {
		document.getElementById('wrapButton').className += " red-btn";
	}		
}
/*  **************************** Испытание 1 ************************** */
function postMsg() {
	/*var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
	xmlhttp.open("POST", "http://careers.intspirit.com/endpoint/post_response", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
	xmlhttp.send(JSON.stringify({name:"John Rambo", time:"2pm"}));
	console.log(xmlhttp);*/
	
	
	/*var xmlhttp;
    xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            alert(xmlhttp.responseText);
            alert("success");
        }
    }

    xmlhttp.open("POST", 'http://careers.intspirit.com/endpoint/post_response', true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xmlhttp.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    xmlhttp.setRequestHeader("Access-Control-Allow-Methods","POST, GET, OPTIONS, DELETE, PUT, HEAD");
    xmlhttp.setRequestHeader("Access-Control-Max-Age","1728000");   
    xmlhttp.send(JSON.stringify({name:"John Rambo", time:"2pm"}));*/
}
