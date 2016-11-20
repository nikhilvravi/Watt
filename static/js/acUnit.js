var states = [];
var costs = [];
var zones = [];
var climateTemps = [];

function main() {
	$.get("../static/data/cost.txt", function(data) {
		var temp = data.split('\n');
		for(var i=0; i<temp.length; i++) {
			var temp2 = temp[i].split('\t');
			states.push(temp2[0]);
			costs.push(parseFloat(temp2[1]));
			zones.push(parseInt(temp2[2]));
			climateTemps.push(parseFloat(temp2[3]));
		}
		
		console.log("Efficiency in 2009: " + convertYearToEfficiency(2009));
		console.log("New York 2009: " + convertWattToCostHeater(heatToWatt(convertYearToEfficiency(2009), "new york", 3000), "new york"));
		/*for(var i = 0; i<100; i+=10) {
			console.log("New York " + i + "%: " + convertWattToCostHeater(heatToWatt(i, "new york", 3000), "new york"));
		}

		for(var i = 90; i<99; i++) {
			console.log("New York " + i + "%: " + convertWattToCostHeater(heatToWatt(i, "new york", 3000), "new york"));
		}*/
	});
}
main();

function convertSqFtToBTU(squarefootage) {
	return squarefootage * 25;
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

function stateToClimateTemp(state) {
	for(var i = 0; i<climateTemps.length; i++) {
		if(state === states[i]) {
			return climateTemps[i];
		}
	}
}

function convertSEERtoWatt(SEER, zone, squarefootage) {
	//Estimated average hours for cooling
	var hoursCooling = 20;

	//Watt = BTU/SEER
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
	var costConverter;
	for(i = 0; i<states.length; i++) {
		if(state == states[i]) {
			costConverter = costs[i];
		}
	}
	cost = (watt/1000) * (costConverter/100);
	return cost.toFixed(2);
}

/*function calcHeatLoss(state, insideTemp, squarefootage) {
	var outsideTemp = stateToClimateTemp(state);
	var thermalResistance = 19;
	var heatLossRate;
	var area;

	area = Math.sqrt()

	heatLossRate = ((area) * (outsideTemp - insideTemp)) / thermalResistance;
}*/

function calcTotalCost(state, year, squarefootage) {
	var watt = convertSEERtoWatt(convertYearToSEER(year), stateToZone(state), squarefootage);
	var cost = convertWattToCost(watt, state);
	return cost;
}

function calcTotalCostSEER(state, SEER, squarefootage) {
	var watt = convertSEERtoWatt(SEER, stateToZone(state), squarefootage);
	var cost = convertWattToCost(watt, state);
	return cost;
}

function costOfRepair(squarefootage) {
	convertSqFtToBTU(squarefootage) * 0.01;
}

function calcBreakEvenRepair(state, year, newYear, squarefootage, priceOfNewModel) {
	var oldModel = calcTotalCost(state, year, squarefootage);
	var newModel = calcTotalCost(state, newYear, squarefootage);
	var repairCost = costOfRepair(squarefootage);
	return (priceOfNewModel - repairCost) / (newModel - oldModel);
}

function calcBreakEven(state, year, squarefootage, priceOfNewModel) {
	var oldModel = calcTotalCost(state, year, squarefootage);
	var newModel = calcTotalCost(state, newYear, squarefootage);
	return (priceOfNewModel) / (newModel - oldModel);
}

function calcTotalCarbonSEER(state, SEER, squarefootage) {
	var watt = convertSEERtoWatt(SEER, stateToZone(state), squarefootage);
	var carbon = (watt/1000)*2;
	return carbon;
}

function calcTotalCarbonYear(state, year, squarefootage) {
	var SEER = convertYearToSEER(year);
	return calcTotalCarbonSEER(state, SEER, squarefootage);
}

// HEATER UNIT

