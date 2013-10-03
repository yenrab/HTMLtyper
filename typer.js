/*
HTMLTyper is a rapid prototyping tool for web pages.
Copyright (C) 2006, 2012  Lee S. Barney

 Permission is hereby granted, free of charge, to any person obtaining a 
 copy of this software and associated documentation files (the "Software"), 
 to deal in the Software without restriction, including without limitation the 
 rights to use, copy, modify, merge, publish, distribute, sublicense, 
 and/or sell copies of the Software, and to permit persons to whom the Software 
 is furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be 
 included in all copies or substantial portions of the Software.

 
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
 PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
 var editors = [];
var display = null;
function setUp(){
	display = document.getElementById('display');
	editors[0] = document.getElementById('html_editor');
	editors[1] = document.getElementById('jscript_editor');
	editors[2] = document.getElementById('css_editor');
	for(var i = 0; i < 3; i++ in editors){
		editors[i].hide = function(){
			this.style.bottom = '-300px';
		};
		editors[i].onclick = function(event){
			stopBubbleUp(event);
			this.hide();
		}
	}
	showHTML();
}

function fixEvent(event){
	event = event ? event : window.event;
	if(!event){//Firefox hack
		event = window.Event;
	}
	return event;
}

function stopBubbleUp(event){
	event = fixEvent(event);
    if (typeof event.stopPropagation != "undefined") {
        event.stopPropagation();
    } else {
        event.cancelBubble = true;
    }
}

function checkedHideAll(event){
	event = fixEvent(event);
	stopBubbleUp(event);
}

var tab = "    ";

function handleTabs(evt)
{
	var isSafari = navigator.userAgent.toLowerCase().indexOf("safari") != -1;
	var kc = evt.which ? evt.which : evt.keyCode;
	evt = fixEvent(evt);
	var t = evt.target;
	if (isTab(evt)){
		t.focus();
		evt.preventDefault();
		var tab = '    ',tablen = tab.length,  tab_regexp = /\n\s\s\s\s/g;
		if(t.value.length == 0){
			t.value = tab;
			return;
		}
		// hack for ie
		if (!t.selectionStart && document.selection)
		{
			var range = document.selection.createRange();
			var stored_range = range.duplicate();
			stored_range.moveToElementText(t);
			stored_range.setEndPoint('EndToEnd', range);
			t.selectionStart = stored_range.text.length - range.text.length;
			t.selectionEnd = t.selectionStart + range.text.length;
			t.setSelectionRange = function(start, end){
				var range = this.createTextRange();
				range.collapse(true);
				range.moveStart("character", start);
				range.moveEnd("character", end - start);
				range.select();
			}
		}
		var tab = '    ',tablen = tab.length,  tab_regexp = /\n\s\s\s\s/g;
		/*if(t.value.length == 0){
			t.value = tab;
			return;
		}*/
		var ss = t.selectionStart, se = t.selectionEnd, ta_val = t.value, sel = ta_val.slice(ss, se); shft = (isSafari && kc == 25) || evt.shiftKey;
		var was_tab = ta_val.slice(ss - tablen, ss) == tab, starts_with_tab = ta_val.slice(ss, ss + tablen) == tab, offset = shft ? 0-tablen : tablen, full_indented_line = false, num_lines = sel.split("\n").length;

		if (ss != se && sel[sel.length-1] == '\n') { se--; sel = ta_val.slice(ss, se); num_lines--; }
		if (num_lines == 1 && starts_with_tab) full_indented_line = true;

		if (!shft || was_tab || num_lines > 1 || full_indented_line)
		{
			// multi-line selection
			if (num_lines > 1)
			{
			// tab each line
				if (shft && (was_tab || starts_with_tab) && sel.split(tab_regexp).length == num_lines)
				{
				if (!was_tab) sel = sel.substring(tablen);
					t.value = ta_val.slice(0, ss - (was_tab ? tablen : 0)).concat(sel.replace(tab_regexp, "\n")).concat(ta_val.slice(se, ta_val.length));
					ss += was_tab ? offset : 0; se += offset * num_lines;
				}
				else if (!shft)
				{
					t.value = ta_val.slice(0, ss).concat(tab).concat(sel.replace(/\n/g, "\n" + tab)).concat(ta_val.slice(se, ta_val.length));
					se += offset * num_lines;
				}
			}

			// single-line selection
			else{
			if (shft)
			t.value = ta_val.slice(0, ss - (full_indented_line ? 0 : tablen)).concat(ta_val.slice(ss + (full_indented_line ? tablen : 0), ta_val.length));
			else
			t.value = ta_val.slice(0, ss).concat(tab).concat(ta_val.slice(ss, ta_val.length));

			if (ss == se)
			ss = se = ss + offset;
			else
			se += offset;
			}
		}
		setTimeout("var t=$('" + t.id + "'); t.focus(); t.setSelectionRange(" + ss + ", " + se + ");", 0);
		return false;
	}
}

function isTab(evt, isSafari){
	evt = fixEvent(evt);
	var kc = evt.which ? evt.which : evt.keyCode;
	if (kc == 9 || (isSafari && kc == 25)){
		evt.preventDefault();
		return true;
	}
}

//inserting and removing the generated HTML
function insertHTML(event){
	try{
		event = fixEvent(event);
		if (isTab(event)){
			return false;
		}
		var htmlContent = document.getElementById('body_area').value
		display.innerHTML = htmlContent.replace(/(\r\n|\n|\r)/gm,"");
	}
	catch(e){}
	return false;
}
function clearHMTL(){
	display.innerHTML = '';
}

//inserting and removing the generated JavaScript
function insertScript(event){
 	try{
		event = fixEvent(event);
		if (isTab(event)){
			return false;
		}
		var scriptContent = document.getElementById('script_area').value;
		var usersScripts = document.getElementById('inserted_Scripts');
		var scriptParent = document.getElementsByTagName('head')[0];
		if(navigator.appName == "Microsoft Internet Explorer"){//IE
			usersScripts.text = scriptContent; // this doesn't work for FireFox
		}
		else
		{
			scriptParent.removeChild(usersScripts);
			usersScripts = document.createElement('script');
			usersScripts.id = 'inserted_Scripts';
			usersScripts.innerHTML= scriptContent;
			scriptParent.appendChild(usersScripts);
			
		}
  	}
  	catch(e){}
	return false;
}
function clearScript(){
  try{
	var scriptContent = document.getElementById('script_area').value;
	var usersScripts = document.getElementById('inserted_Scripts');
	var scriptParent = document.getElementsByTagName('head')[0];
	if(navigator.appName == "Microsoft Internet Explorer"){//IE
		usersScripts.text = ''; // this doesn't work for FireFox
	}
	else
	{
		scriptParent.removeChild(usersScripts);
		usersScripts = document.createElement('script');
		usersScripts.id = 'inserted_Scripts';
		scriptParent.appendChild(usersScripts);
	}
  }
  catch(e){}
}

//inserting and removing the generated CSS classes
function insertCSS(event){
    try{
		event = fixEvent(event);
		if (isTab(event)){
			return false;
		}
		var cssContent = document.getElementById('style_area').value;
		//style.innerHTML is read only in IE
		if(navigator.appName == "Microsoft Internet Explorer"){//IE
			var styleParent = document.getElementsByTagName('head')[0];
			var curCustCSS = document.getElementById('inserted_CSS');
			if(curCustCSS != null){
				styleParent.removeChild(curCustCSS);
			}
			styleParent.insertAdjacentHTML('afterBegin', "%nbsp;<style id='inserted_CSS'>"+cssContent+"</style>");

		}
		else{
			var is_safari = (document.childNodes)&&(!document.all)&&(!navigator.taintEnabled)&&(!navigator.accentColorName)?true:false;
			if(is_safari){
				document.getElementById('inserted_CSS').innerText = cssContent;
			}
			else{
				document.getElementById('inserted_CSS').innerHTML = cssContent;
			}
		}
    }
    catch(e){}
	return false;
}
function clearCSS(){
	 try{
		var cssContent = document.getElementById('style_area').value;
		//style.innerHTML is read only in IE
		if(navigator.appName == "Microsoft Internet Explorer"){//IE
			var styleParent = document.getElementsByTagName('head')[0];
			var curCustCSS = document.getElementById('inserted_CSS');
			if(curCustCSS != null){
				styleParent.removeChild(curCustCSS);
			}

		}
		else{
			var is_safari = (document.childNodes)&&(!document.all)&&(!navigator.taintEnabled)&&(!navigator.accentColorName)?true:false;
			if(is_safari){
				document.getElementById('inserted_CSS').innerText = '';
			}
			else{
				document.getElementById('inserted_CSS').innerHTML = '';
			}
		}
    }
    catch(e){}
}
function clearAll(){
	stopBubbleUp();
	clearCSS();
	clearScript();
	clearHMTL();
	document.getElementById('body_area').value = "";
	document.getElementById('script_area').value = "";
	document.getElementById('style_area').value = "";
}
function showSource(){
	
	document.getElementById('sourceDisplayer').style.left = '0%';
	document.getElementById('editorButtons').style.bottom = '-80px';
	document.getElementById('sourceDisplayButtons').style.bottom = '10px';
	var headerStr = '<!DOCTYPE html>\n'
	+'<html lang="en-us">\n'
	+'<head>\n'
	+'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n'
	
	+'\n<title>Insert title here</title>\n<style>\n';

	var sourceDisplay = document.getElementById('all_source_area');
	sourceDisplay.value = headerStr;
	sourceDisplay.value = sourceDisplay.value + document.getElementById('style_area').value;
	sourceDisplay.value = sourceDisplay.value + "\n<"+"/"+"style>\n<script>\n";//work around!!!!!
	sourceDisplay.value = sourceDisplay.value + document.getElementById('script_area').value;
	sourceDisplay.value = sourceDisplay.value + "\n<"+"/"+"script>\n</head>\n<body>\n";//work around!!!!
	sourceDisplay.value = sourceDisplay.value + document.getElementById('body_area').value;
	sourceDisplay.value = sourceDisplay.value + "\n</body>\n</html>";
}

function hideSource(){
	document.getElementById('sourceDisplayer').style.left = '110%';
	document.getElementById('editorButtons').style.bottom = '10px';
	document.getElementById('sourceDisplayButtons').style.bottom = '-80px';
}

function showBuilder(){
	document.getElementById('builder').className = "shown";
	document.getElementById('full_source').className = "hidden";
}
/*
*	show and hide the editor elements and the associated buttons
*/
function showHTML(event){
	var evt = fixEvent(event);
    if (typeof evt.stopPropagation != "undefined") {
        evt.stopPropagation();
    } else {
        evt.cancelBubble = true;
    }
	var theEditor = document.getElementById('html_editor');
	theEditor.style.bottom = '0px';
	document.getElementById('body_area').focus();
	hideAllEditorsBut(theEditor);
}
function showJS(event){
	evt = fixEvent(event);
    if (typeof evt.stopPropagation != "undefined") {
        evt.stopPropagation();
    } else {
        evt.cancelBubble = true;
    }
	var theEditor = document.getElementById('jscript_editor');
	theEditor.style.bottom = '0px';
	document.getElementById('script_area').focus();
	hideAllEditorsBut(theEditor);
}
function showCSS(event){
	evt = fixEvent(event);
    if (typeof evt.stopPropagation != "undefined") {
        evt.stopPropagation();
    } else {
        evt.cancelBubble = true;
    }	
	var theEditor = document.getElementById('css_editor');
	theEditor.style.bottom = '0px';
	document.getElementById('style_area').focus();
	hideAllEditorsBut(theEditor);
}
function hideAllEditorsBut(theEditor){
	for(var i = 0; i < editors.length; i++){
		var anEditor = editors[i];
		if(anEditor == theEditor){
			continue;
		}
		//execute the specific editors hide function
		anEditor.hide();
	}
}
function hideAll(){
	for(var i = 0; i < editors.length; i++){
		var anEditor = editors[i];
		anEditor.hide();
	}
}

function selectEditor(textArea){
	bringToFront(textArea.parentNode);
}

function showOpenDialog(){
	document.getElementById('saveDialog').style.display = 'block';
}


/*
*	Store HTML, CSS, and JavaScript in local storage
*/
var htPrefix = 'h_t_';
var curFileName = null;
function saveFile(shouldSaveAs) {
	stopBubbleUp();
	if(curFileName == null || shouldSaveAs){
		var fileName=window.prompt("Save File: ");
		if(fileName == null){
			return;
		}
		curFileName = fileName;
	}
	var codeArray = {
		'HTML': escape(document.getElementById('body_area').value),
		'JS': escape(document.getElementById('script_area').value),
		'CSS': escape(document.getElementById('style_area').value)
	}
	localStorage.setItem(htPrefix+curFileName, JSON.stringify(codeArray));
}

function openFile(){
	stopBubbleUp();
	var selector = document.getElementById('fileList');
	for(var retrievedFileName in localStorage){
		if(retrievedFileName.indexOf(htPrefix) == 0){
			retrievedFileName = retrievedFileName.substring(4);
			var anOption = document.createElement('option');
			anOption.value = retrievedFileName;
			anOption.innerHTML = retrievedFileName;
			selector.appendChild(anOption);
		}
	}
	document.getElementById('openDialog').style.display = 'block';
}

function readFile(aButton) {
	stopBubbleUp();
	var selector = document.getElementById('fileList');
	document.getElementById('openDialog').style.display = 'none';
	if(aButton.value == 'Open'){
		clearAll();
		/*
		*	get the name of the selected file
		*/
		if(selector.selectedIndex >=0){
			var name = selector.options[selector.selectedIndex].value;
			curFileName = name;

			var storedData = JSON.parse(localStorage[htPrefix+curFileName]);
			if(storedData.HTML){
				document.getElementById('body_area').value = unescape(storedData.HTML);
				insertHTML();
			}
			if(storedData.JS){
				document.getElementById('script_area').value = unescape(storedData.JS);
				insertScript();
			}
			if(storedData.CSS){
				document.getElementById('style_area').value = unescape(storedData.CSS);
				insertCSS();
			}
		}
	}
	document.getElementById('openDialog').style.display = 'none';
	selector.innerHTML = '';
}
function showDeleteDialog(){
	stopBubbleUp();
	document.getElementById('deleteDialog').style.display = 'block';
	var selector = document.getElementById('deleteFileList');
	selector.innerHTML = '';

	for(var retrievedFileName in localStorage){
		if(retrievedFileName.indexOf(htPrefix) == 0){
			retrievedFileName = retrievedFileName.substring(4);
			var anOption = document.createElement('option');
			anOption.value = retrievedFileName;
			anOption.innerHTML = retrievedFileName;
			selector.appendChild(anOption);
		}
	}
}
function deleteFiles(aButton) {
	stopBubbleUp();
	document.getElementById('deleteDialog').style.display = 'none';
	if(aButton.value == 'Delete'){
		var selector = document.getElementById('deleteFileList');
		if(selector.options[selector.selectedIndex]){
			var name = selector.options[selector.selectedIndex].value;
			localStorage.removeItem(htPrefix+name);
			if(curFileName == name){
				clearAll();
				curFileName = null;
			}
		}
	}

}