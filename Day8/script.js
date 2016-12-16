// constants
var interlaceLineHeight = 1,
	interlaceStep = 1,
	screenPixelWidth = 50,
	screenPixelHeight = 6;
	pixelWidth = 19,
	pixelMargin = 4,
	pixelInnerMargin = 2,
	pixelWrapBorderWidth = 2,
	rectRegex = /rect (\d+)x(\d+)/,
	rotateRegex = /rotate (.+?) (.)=(\d+) by (\d+)/,
	rotationInterval = 25,
	instructionInterval = 1;

(function() {
	var screen = null,
		canvas = null,
		answer = null,
		instruction = null,
		instructionNo = null,
		pixels = [];

	function formatPixelId(x, y) { return 'pixel-' + x + '-' + y; }
	function setInstruction(txt) { instruction.innerHTML = txt || '&nbsp;'; }

	/*
	 * Get pixel DOM element by position
	 */
	function getPixelAt(x, y) {
		if(x >= screenPixelWidth || x < 0)
			return null;
		if(y >= screenPixelHeight || y < 0)
			return null;
		
		if(!(pixels[y] instanceof Array))
			pixels[y] = [];
		if(!pixels[y][x])
			pixels[y][x] = document.getElementById(formatPixelId(x, y));
		return pixels[y][x];
		//return document.getElementById(formatPixelId(x, y));
	}

	/*
	 * Switch pixel on or off
	 */
	function switchPixel(on, x, y) {
		var pixel = getPixelAt(x, y);
		if(pixel == null)
			return;
		if(on === true || on === 'on') {
			if(pixel.className.indexOf('lit') < 0){
				pixel.className += ' lit';
			}
		}
		else if (pixel.className.indexOf('lit') >= 0) {
			pixel.className = pixel.className.replace('lit', '').trim();
		}
	}

	function copyPixelState(fromX, fromY, toX, toY) {
		var from = getPixelAt(fromX, fromY),
			to = getPixelAt(toX, toY);
		if(from.className != to.className)
			to.className = from.className;
	}

	function rect(width, height, currentX, currentY, callback) {
		if(typeof currentX !== 'number')
				currentX = 0;
		if(typeof currentY !== 'number')
			currentY = 0;
		if(currentY === 0 && currentX === 0)
			setInstruction('Filling rectangle ' + width + ' x ' + height);

		if(rotationInterval === 0) {
			// synchronous logic
			for(var x = 0; x < width; x++)
				for(var y = 0; y < height; y++)
					switchPixel(true, x, y);
		} else {
			// callback hell logic
			if(currentX >= width) {
				currentX = 0;
				currentY++;
			}
			if(currentY >= height)
				return callback();

			switchPixel(true, currentX, currentY);
			setTimeout(function() { rect(width, height, currentX + 1, currentY, callback); }, rotationInterval);
		}

	}

	function rotateRow(y, numOfRotations, currentRotation, callback) {
		if(typeof currentRotation !== 'number')
			currentRotation = 0;
		if(numOfRotations >= screenPixelWidth)
			numOfRotations = screenPixelWidth % numOfRotations;
		if(numOfRotations == 0)
			return;

		if(currentRotation === 0)
			setInstruction('Rotating row ' + y + ' by ' + numOfRotations + ' pixels');

		var cache = [];
		if(rotationInterval === 0) {
			// synchronous logic
			for(var i = numOfRotations; i < screenPixelWidth; i++)
				cache.push(getPixelAt(i, y).className);
			for(var i = 0; i < screenPixelWidth - numOfRotations; y++) {
				copyPixelState(i, y, i + numOfRotations, y);
				if(i < numOfRotations)
					getPixelAt(i, y).className = cache[i];
			}
		} else {
			//callback hell logic
			if(currentRotation >= numOfRotations)
				return callback();
			cache.push(getPixelAt(screenPixelWidth - 1, y).className);
			for(var i = screenPixelWidth - 1; i > 0; i = i - 1)
				copyPixelState(i - 1, y, i, y);
			getPixelAt(0, y).className = cache[0];
			setTimeout(function() { rotateRow(y, numOfRotations, currentRotation + 1, callback)}, rotationInterval);
		}
	}

	function rotateColumn(x, numOfRotations, currentRotation, callback) {
		if(typeof currentRotation !== 'number')
			currentRotation = 0;
		if(numOfRotations >= screenPixelHeight)
			numOfRotations = screenPixelHeight % numOfRotations;
		if(numOfRotations == 0)
			return;

		if(currentRotation === 0)
			setInstruction('Rotating column ' + x + ' by ' + numOfRotations + ' pixels');

		var cache = [];
		if(rotationInterval === 0) {
			// synchronous logic
			for(var i = numOfRotations; i < screenPixelWidth; i++)
				cache.push(getPixelAt(x, i).className);
			for(var i = 0; i < screenPixelWidth - numOfRotations; y++) {
				copyPixelState(x, i, x, i + numOfRotations);
				if(i < numOfRotations)
					getPixelAt(x, i).className = cache[i];
			}
		} else {
			//callback hell logic
			if(currentRotation >= numOfRotations)
				return callback();
			cache.push(getPixelAt(x, screenPixelHeight - 1).className);
			for(var i = screenPixelHeight - 1; i > 0; i = i - 1)
				copyPixelState(x, i - 1, x, i);
			getPixelAt(x, 0).className = cache[0];
			setTimeout(function() { rotateColumn(x, numOfRotations, currentRotation + 1, callback)}, rotationInterval);
		}
	}

	/*
	 * Process the raw instruction
	 */
	function processInstruction(instructionIdx) {
		//console.log('processing instruction', instructionIdx);

		instructionNo.innerHTML = (instructionIdx + 1) + ' of ' + window.instructions.length;
		var doneFn = function() {
			//instruction.innerHTML += ' - Done!';
			answer.innerHTML = document.querySelectorAll('#screen .pixel.lit').length;
			setTimeout(function() { processInstruction(instructionIdx + 1)}, instructionInterval);
		}

		var instr = window.instructions[instructionIdx];
		if(!instr)
			return;

		var match = instr.match(rotateRegex);
		if(match != null) {
			if(match[1] == 'row')
				rotateRow(parseInt(match[3]), parseInt(match[4]), 0, doneFn);
			else
				rotateColumn(parseInt(match[3]), parseInt(match[4]), 0, doneFn);
		} else {
			match = instr.match(rectRegex);
			rect(parseInt(match[1]), parseInt(match[2]), 0, 0, doneFn);
		}
	}

	// Initialize
	screen = document.getElementById('screen');
	answer = document.getElementById('answer');

	// create interlaced lines
	var currentTop = interlaceLineHeight,
		interlaceHtml = '';
	while(currentTop < 1200) {
		interlaceHtml += '<div class="interlace-line" style="top: ' + currentTop + 'px; height: ' + interlaceLineHeight + 'px;"></div>';
		currentTop += interlaceLineHeight + interlaceStep;
	}

	document.getElementById('interlace-lines-wrap').innerHTML = interlaceHtml;

	// position screen div
	var screenHeight = 6 * (pixelWidth + pixelInnerMargin * 2 + pixelWrapBorderWidth * 2) + 7 * pixelMargin;
	screen.style.width = (50 * (pixelWidth + pixelInnerMargin * 2 + pixelWrapBorderWidth * 2) + 51 * pixelMargin) + 'px';
	screen.style.height = screenHeight + 'px';
	instruction = document.getElementById('instruction');
	instruction = document.getElementById('instruction');
	instructionNo = document.getElementById('instruction-no');
	var instructionWrap = document.getElementById('instruction-wrap');
	instructionWrap.style.marginTop = parseInt(document.body.clientHeight / 2 - screenHeight / 2 - instructionWrap.clientHeight) + 'px';

	// create pixels HTML
	var pixelsHtml = '',
		pixelStyle = ' style="width: ' + pixelWidth + 'px; height: ' + pixelWidth + 'px; margin: ' + pixelInnerMargin + 'px; "',
		pixelWrapStyle = ' style="margin: 0 ' + pixelMargin + 'px ' + pixelMargin + 'px + 0; border-width: ' + pixelWrapBorderWidth + 'px;"';
	for(var y = 0; y < screenPixelHeight; y++) 
		for(var x = 0; x < screenPixelWidth; x++) 
			pixelsHtml += '<div class="pixel-wrap"' + pixelWrapStyle + '><div id="' + formatPixelId(x, y) + '" class="pixel"' + pixelStyle + '></div></div>';
	screen.innerHTML = pixelsHtml;

	var interval = null;
	var counters = [0, -1, -2 , -3, -4, -5];
	var tempfn = function() {
		if(counters[5] >= 50) {
			clearInterval(interval);
			return;
		}
		for(var y = 0; y < 6; y++) {
			switchPixel('off', counters[y] - 1, y);
			switchPixel('on', counters[y], y);
			counters[y]++;
		}

		answer.innerHTML = document.querySelectorAll('#screen .pixel.lit').length;
	};

	processInstruction(0);
})();