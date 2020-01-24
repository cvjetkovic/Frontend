/*
    <!--
  __       _________    ____       _____            __                     
 / /     _/_/ ____/ |  / /\ \     / ___/__  _______/ /____  ____ ___  _____
/ /    _/_// /    | | / /  \ \    \__ \/ / / / ___/ __/ _ \/ __ `__ \/ ___/
\ \  _/_/ / /___  | |/ /   / /   ___/ / /_/ (__  ) /_/  __/ / / / / (__  ) 
 \_\/_/   \____/  |___/   /_/   /____/\__, /____/\__/\___/_/ /_/ /_/____/  
                                     /____/                                

https://cvsystems.rs
-->
*/
function manageResize(md, sizeProp, posProp) {
	var r = md.target;

	var prev = r.previousElementSibling;
	var next = r.nextElementSibling;
	if (!prev || !next) {
		return;
	}

	md.preventDefault();

	var prevSize = prev[sizeProp];
	var nextSize = next[sizeProp];
	var sumSize = prevSize + nextSize;
	var prevGrow = Number(prev.style.flexGrow);
	var nextGrow = Number(next.style.flexGrow);
	var sumGrow = prevGrow + nextGrow;
	var lastPos = md[posProp];

	function onMouseMove(mm) {
		var pos = mm[posProp];
		var d = pos - lastPos;
		prevSize += d;
		nextSize -= d;
		if (prevSize < 0) {
			nextSize += prevSize;
			pos -= prevSize;
			prevSize = 0;
		}
		if (nextSize < 0) {
			prevSize += nextSize;
			pos += nextSize;
			nextSize = 0;
		}

		var prevGrowNew = sumGrow * (prevSize / sumSize);
		var nextGrowNew = sumGrow * (nextSize / sumSize);

		prev.style.flexGrow = prevGrowNew;
		next.style.flexGrow = nextGrowNew;

		lastPos = pos;
	}

	function onMouseUp(mu) {
		// Change cursor to signal a state's change: stop resizing.
		const html = document.querySelector('html');
		html.style.cursor = 'default';

		if (posProp === 'pageX') {
			r.style.cursor = 'ew-resize';
		} else {
			r.style.cursor = 'ns-resize';
		}

		window.removeEventListener("mousemove", onMouseMove);
		window.removeEventListener("mouseup", onMouseUp);
	}

	window.addEventListener("mousemove", onMouseMove);
	window.addEventListener("mouseup", onMouseUp);
}

function setupResizerEvents() {
	document.body.addEventListener("mousedown", function (md) {

		// Used to avoid cursor's flickering
		const html = document.querySelector('html');

		var target = md.target;
		if (target.nodeType !== 1 || target.tagName !== "FLEX-RESIZER") {
			return;
		}
		var parent = target.parentNode;
		var h = parent.classList.contains("h");
		var v = parent.classList.contains("v");
		if (h && v) {
			return;
		} else if (h) {
			// Change cursor to signal a state's change: begin resizing on H.
			target.style.cursor = 'col-resize';
			html.style.cursor = 'col-resize'; // avoid cursor's flickering

			// use clientWidth versus scrollWidth to avoid splitter's jump on resize.
			manageResize(md, "clientWidth", "pageX");

		} else if (v) {
			// Change cursor to signal a state's change: begin resizing on V.
			target.style.cursor = 'row-resize';
			html.style.cursor = 'row-resize'; // avoid cursor's flickering

			manageResize(md, "clientHeight", "pageY");
		}
	});
}

setupResizerEvents();

// Hide/show on resizer double mouse click

// Left menu
function hideLeftMenu() {
	// Cache the hidden menu, toggle the class
	var hiddenElement = document.querySelector('.leftMenu');
	hiddenElement.classList.toggle('hiddenLeftMenu');
}

var button = document.getElementById('hideShowOnClickLeft');
button.addEventListener('dblclick', hideLeftMenu);

// Header
function hideHeader() {
	// Cache the hidden menu, toggle the class
	var hiddenElement = document.querySelector('.header');
	hiddenElement.classList.toggle('hiddenHeader');
}

var button = document.getElementById('hideShowOnClickHeader');
button.addEventListener('dblclick', hideHeader);

// Footer
function hideFooter() {
	// Cache the hidden menu, toggle the class
	var hiddenElement = document.querySelector('.footer');
	hiddenElement.classList.toggle('hiddenFooter');
}

var button = document.getElementById('hideShowOnClickFooter');
button.addEventListener('dblclick', hideFooter);
