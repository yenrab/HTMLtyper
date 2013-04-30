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

function stopBubbleUp(event){
	event = event ? event : window.event;
    if (typeof event.stopPropagation != "undefined") {
        event.stopPropagation();
    } else {
        event.cancelBubble = true;
    }
}

function checkedHideAll(event){
	event = event ? event : window.event;
	stopBubbleUp(event);
}

function insertTab(textarea,event) {
	/*
	*	this code is currently unused due to compatibility and speed issues.
	*/
		var tabKeyCode = 9;
		if (event.which) // mozilla
			var keycode = event.which;
		else // ie
			var keycode = event.keyCode;
			
		var specialKey  = event.keyCode;
		
		if((keycode != 9 && keycode < 31) || (specialKey >= 37 && specialKey <=40) || (specialKey >= 63232 && specialKey <=632235)){
			return true;
		}
		if (textarea.setSelectionRange) {
			// mozilla
			var s = textarea.selectionStart;
			var e = textarea.selectionEnd;
			if (keycode == tabKeyCode) {
				textarea.value = textarea.value.substring(0, s) + 
					"\t" + textarea.value.substr(e);
			}
			else{
				textarea.value = textarea.value.substring(0, s) + 
					String.fromCharCode(event.which) + textarea.value.substr(e);
			}
			textarea.setSelectionRange(s + 1, s + 1);
			textarea.focus();
		} else if (textarea.createTextRange) {
			// ie
			document.selection.createRange().text="\t"
			textarea.onblur = function() { this.focus(); this.onblur = null; };
		} else {
			// unsupported browsers
		}
		if (event.returnValue) // ie ?
			event.returnValue = false;
		if (event.preventDefault) // dom
			event.preventDefault();
		
		if(textarea.id == 'body_area'){
			insertHTML();
		}
		else if(textarea.id == 'script_area'){
			insertScript(event);
		}
		else if(textarea.id == 'style_area'){
			insertCSS();
		}
		return false;
	}

	//inserting and removing the generated HTML
	function insertHTML(){
	   try{
			var htmlContent = document.getElementById('body_area').value
			display.innerHTML = htmlContent.replace(/(\r\n|\n|\r)/gm,"");
		}
		catch(e){}
	}
	function clearHMTL(){
		display.innerHTML = '';
	}
	
	//inserting and removing the generated JavaScript
	function insertScript(){
	  try{
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
	function insertCSS(){
            try{
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
		
		document.getElementById('sourceDisplayer').style.left = '0px';
		var headerStr = '<!DOCTYPE html>\n<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n<title>Insert title here</title>\n<style>\n';

		var sourceDisplay = document.getElementById('full_source_display');
		sourceDisplay.value = headerStr;
		sourceDisplay.value = sourceDisplay.value + document.getElementById('style_area').value;
		sourceDisplay.value = sourceDisplay.value + "\n<"+"/"+"style>\n<script>\n";//work around!!!!!
		sourceDisplay.value = sourceDisplay.value + document.getElementById('script_area').value;
		sourceDisplay.value = sourceDisplay.value + "\n<"+"/"+"script>\n<body>\n";//work around!!!!
		sourceDisplay.value = sourceDisplay.value + document.getElementById('body_area').value;
		sourceDisplay.value = sourceDisplay.value + "\n</body>\n</html>";

		document.getElementById('builder').className = "hidden";
		document.getElementById('full_source').className = "shown";
	}

	function showBuilder(){
		document.getElementById('builder').className = "shown";
		document.getElementById('full_source').className = "hidden";
	}
	/*
	*	show and hide the editor elements and the associated buttons
	*/
	function showHTML(){
		evt = window.event;
	    if (typeof evt.stopPropagation != "undefined") {
	        evt.stopPropagation();
	    } else {
	        evt.cancelBubble = true;
	    }
		var theEditor = document.getElementById('html_editor');
		theEditor.style.bottom = '0px';
		hideAllEditorsBut(theEditor);
	}
	function showJS(){
		evt = window.event;
	    if (typeof evt.stopPropagation != "undefined") {
	        evt.stopPropagation();
	    } else {
	        evt.cancelBubble = true;
	    }
		var theEditor = document.getElementById('jscript_editor');
		theEditor.style.bottom = '0px';
		hideAllEditorsBut(theEditor);
	}
	function showCSS(){
		evt = window.event;
	    if (typeof evt.stopPropagation != "undefined") {
	        evt.stopPropagation();
	    } else {
	        evt.cancelBubble = true;
	    }	
		var theEditor = document.getElementById('css_editor');
		theEditor.style.bottom = '0px';
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
	
	function resizeMenu(){
		var menu = document.getElementById('menu');
		if(menu.isMinimized){
			var buttonWidth = '125px';
			menuButtons[0].value = '-';
			menuButtons[0].style.minWidth = buttonWidth;
			
			menuButtons[1].value = 'Add HTML';
			menuButtons[1].style.minWidth = buttonWidth;
			
			menuButtons[2].value = 'Add JavaScript';
			menuButtons[2].style.minWidth = buttonWidth;
			
			menuButtons[3].value = 'Add CSS';
			menuButtons[3].style.minWidth = buttonWidth;
			
			menuButtons[4].value = 'Clear All';
			menuButtons[4].style.minWidth = buttonWidth;
			
			menuButtons[5].value = 'Show Source';
			menuButtons[5].style.minWidth = buttonWidth;
			
			menuButtons[6].value = 'Open File';
			menuButtons[6].style.minWidth = buttonWidth;
			
			menuButtons[7].value = 'Save File';
			menuButtons[7].style.minWidth = buttonWidth;
			
			menuButtons[8].value = 'Save File As';
			menuButtons[8].style.minWidth = buttonWidth;
			
			menuButtons[9].value = 'Delete File';
			menuButtons[9].style.minWidth = buttonWidth;
			
			menu.isMinimized = false;
		}
		else{
			var buttonWidth = '50px';
			menuButtons[0].value = '+';
			menuButtons[0].style.minWidth = buttonWidth;
			
			menuButtons[1].value = 'AH';
			menuButtons[1].style.minWidth = buttonWidth;
			
			menuButtons[2].value = 'AJ';
			menuButtons[2].style.minWidth = buttonWidth;
			
			menuButtons[3].value = 'AC';
			menuButtons[3].style.minWidth = buttonWidth;
			
			menuButtons[4].value = 'CA';
			menuButtons[4].style.minWidth = buttonWidth;
			
			menuButtons[5].value = 'SS';
			menuButtons[5].style.minWidth = buttonWidth;
			
			menuButtons[6].value = 'OF';
			menuButtons[6].style.minWidth = buttonWidth;
			
			menuButtons[7].value = 'SF';
			menuButtons[7].style.minWidth = buttonWidth;
			
			menuButtons[8].value = 'SFA';
			menuButtons[8].style.minWidth = buttonWidth;
			
			menuButtons[9].value = 'DF';
			menuButtons[9].style.minWidth = buttonWidth;
			
			
			menu.isMinimized = true;
		}
	}
	function resizeOrDrag(event){
		
		if(editorToMove != null){
			dragIt(event);
		}
		if(textAreaToResize != null){
			resizeIt(event);
		}
	}
	function doneResizingOrDragging(event){
		
		if(editorToMove != null){
			doneDragging();
		}
		if(editorToResize != null){
			doneResizing();
		}
	}

	var newLineSequence = '-NeW_lInE-';
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
				anOption.innerText = retrievedFileName;
				selector.appendChild(anOption);
			}
		}
		document.getElementById('openDialog').style.display = 'block';
	}

	function readFile(aButton) {
		stopBubbleUp();
		var selector = document.getElementById('fileList');
		document.getElementById('openDialog').style.display = 'none';
		clearAll();
		if(aButton.value == 'Open'){
		
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
				anOption.innerText = retrievedFileName;
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