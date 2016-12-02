/* assume 
 *	0 = north
 *	1 = east
 * 	2 = south
 * 	3 = west

 * 	north is + and south is - on the y axis
 *	east is + and west is - on the x axis
 */

var currentDirection, xAxis, yAxis;

function changeDirection(leftRight) {
	currentDirection = currentDirection + (leftRight == 'R' ? 1 : -1);
	if(currentDirection < 0)
		currentDirection = 3;
	else if(currentDirection > 3)
		currentDirection = 0;
}

function advance(num) {
	switch(currentDirection) {
		case 0: yAxis += num; break;
		case 1: xAxis += num; break;
		case 2: yAxis -= num; break;
		case 3: xAxis -= num; break;
	}
}

function howManyBocksAway(input) {
	currentDirection = 0;
	xAxis = 0;
	yAxis = 0;

	var instructionsArr = input.split(', ');
	for(var i = 0; i < instructionsArr.length; i++) {
		var instruction = instructionsArr[i],
			direction = instruction.substr(0, 1),
			num = parseInt(instruction.substr(1));
		
		changeDirection(direction);
		advance(num);
	}
	return Math.abs(xAxis) + Math.abs(yAxis);
}

// YOUR INPUT
var myInput = 'R1, R1, R3, R1, R1, L2, R5, L2, R5, R1, R4, L2, R3, L3, R4, L5, R4, R4, R1, L5, L4, R5, R3, L1, R4, R3, L2, L1, R3, L4, R3, L2, R5, R190, R3, R5, L5, L1, R54, L3, L4, L1, R4, R1, R3, L1, L1, R2, L2, R2, R5, L3, R4, R76, L3, R4, R191, R5, R5, L5, L4, L5, L3, R1, R3, R2, L2, L2, L4, L5, L4, R5, R4, R4, R2, R3, R4, L3, L2, R5, R3, L2, L1, R2, L3, R2, L1, L1, R1, L3, R5, L5, L1, L2, R5, R3, L3, R3, R5, R2, R5, R5, L5, L5, R2, L3, L5, L2, L1, R2, R2, L2, R2, L3, L2, R3, L5, R4, L4, L5, R3, L4, R1, R3, R2, R4, L2, L3, R2, L5, R5, R4, L2, R4, L1, L3, L1, L3, R1, R2, R1, L5, R5, R3, L3, L3, L2, R4, R2, L5, L1, L1, L5, L4, L1, L1, R1';
// YOUR INPUT END

console.log('Part 1 Answer:', howManyBocksAway(myInput));