var states = [];
var costs = [];
var zones = [];

function main() {
	$.get("../static/data/cost.txt", function(data) {
		var temp = data.split('\n');
		for(var i=0; i<temp.length; i++) {
			var temp2 = temp[i].split('\t');
			states.push(temp2[0]);
			costs.push(parseFloat(temp2[1]));
			zones.push(parseInt(temp2[2]));
		}

		//test functions here

		// Returns zone
		console.log(convertSqFtToBTU(3000));

		// Returns Watt
		var wattNY = convertSEERtoWatt(convertYearToSEER(2000), stateToZone("new york"), 3000);
		//console.log(wattNY);

		var wattTX = convertSEERtoWatt(convertYearToSEER(2000), stateToZone("texas"), 3000);
		//console.log(wattTX);

		var wattNC = convertSEERtoWatt(convertYearToSEER(2000), stateToZone("north carolina"), 3000);
		//console.log(wattNY);

		var wattNY2016 = convertSEERtoWatt(convertYearToSEER(2016), stateToZone("new york"), 3000);
		//console.log(wattNY2016);

		var wattTX2016 = convertSEERtoWatt(convertYearToSEER(2016), stateToZone("texas"), 3000);
		//console.log(wattTX2016);

		var wattNC2016 = convertSEERtoWatt(convertYearToSEER(2016), stateToZone("north carolina"), 3000);
		// Returns 

		console.log("New York Cost of 2000: " + convertWattToCost(wattNY,"new york"));

		console.log("New York Cost of 2016: " + convertWattToCost(wattNY2016, "new york"));

		console.log("Texas Cost of 2000: " + convertWattToCost(wattTX,"texas"));

		console.log("Texas Cost of 2016: " + convertWattToCost(wattTX2016, "texas"));

		console.log("NC Cost of 2000: " + convertWattToCost(wattNC, "north carolina"));

		console.log("NC Cost of 2016: " + convertWattToCost(wattNC2016, "north carolina"));
	});
}
main();


function convertSqFtToBTU(squarefootage) {
	
	return squarefootage * 25;
	/*if (zone == 1) {
		return 32.5*squarefootage;
	} else if (zone == 2) {
		return 37.5*squarefootage;
	} else if (zone == 3) {
		return 42.5*squarefootage;
	} else if (zone = 4) {
		return 47.5*squarefootage;
	} else if (zone = 5) {
		return 55*squarefootage;
	}*/

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
	var hoursCooling = 20;

	// Watt = BTU / SEER
	if(zone == 1) {
		return ((convertSqFtToBTU(squarefootage) * hoursCooling * (299.43))) / SEER;
	} else if (zone == 2) {
		return ((convertSqFtToBTU(squarefootage) * hoursCooling * (265.73))) / SEER;
	} else if (zone == 3) {
		return ((convertSqFtToBTU(squarefootage) * hoursCooling * (247.89))) / SEER;
	} else if (zone == 4) {
		return ((convertSqFtToBTU(squarefootage) * hoursCooling * (195.38))) / SEER;
	} else if (zone == 5) {
		return ((convertSqFtToBTU(squarefootage) * hoursCooling * (176.25))) / SEER;
	}
}


function stateToZone(state) {
	for(i=0; i<states.length; i++) {
		if(state === states[i]) {
			return(zones[i]);
		}
	}
	return("ERROR: state not found!");
}

function convertWattToCost(watt, state) {
	for(i = 0; i<states.length; i++) {
		if(state == states[i]) {
			costConverter = costs[i];
		}
	}
	
	cost = (watt/1000) * (costConverter/100);

	return cost;
}

function calcTotalCost(state, year, squarefootage) {
	var watt = convertSEERtoWatt(convertYearToSEER(year), stateToZone(state), squarefootage);
	var cost = convertWattToCost(watt, state);
	return cost;
}

function calcYearBreakEven(cost, newUnitCost) {

}