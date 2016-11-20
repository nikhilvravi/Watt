/**
function calculateBTUPerZone(zone, squarefootage) {
	
	if (zone == 1) {
		return 32.5*squarefootage;
	} else if (zone == 2) {
		return 37.5*squarefootage;
	} else if (zone == 3) {
		return 42.5*squarefootage;
	} else if (zone = 4) {
		return 47.5*squarefootage;
	} else if (zone = 5) {
		return 55*squarefootage;
	}

}

function convertBTUtoWatt(BTU) {
	return BTU*0.000293071;
}

function convertYearToSEER(year) {
	if (year <= 1980) {
		return 4;
	} else if (year <= 1985 && year > 1980) {
		return 6.5;
	} else if (year <= 1991 && year > 1985) {
		return 7.5;
	} else if (year <= 2005 && year > 1991) {
		return 11;
	} else if (year > 2005) {
		return 15;
	}
}

function convertSEERtoWatt(SEER, zone, squarefootage) {

	// Estimated average hours for cooling
	var hoursCooling = 8;

	// Watt = BTU / SEER
	if(zone == 1) {
		return (calculateBTUPerZone(1, squarefootage)) / SEER;
	} else if (zone == 2) {
		return (calculateBTUPerZone(2, squarefootage)) / SEER;
	} else if (zone == 3) {
		return (calculateBTUPerZone(3, squarefootage)) / SEER;
	} else if (zone == 4) {
		return (calculateBTUPerZone(4, squarefootage)) / SEER;
	} else if (zone == 5) {
		return (calculateBTUPerZone(5, squarefootage)) / SEER;
	}
}
**/

function stateToZone(state) {
	$.get("../static/data/state-energy-cost.txt", function(data) {
		console.log(data);
		var states = [];
		var costs = [];
		var zones = [];

		var temp = data.split('\n');
		console.log(temp);
		for(var i=0; i<temp.length; i++) {
			var temp2 = temp[i].split('\t');
			states.push(temp2[0]);
			costs.push(temp2[1]);
			zones.push(temp2[2]);
		}

		console.log(states);
		console.log(costs);
		console.log(zones);

		for(i = 0; i<states.length; i++) {
			if(state == states[i]) {
				return zones[i];
			}
		}
	});
}

//function convertWatttoCost() {}