function main() {
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

function convertYearToEfficiency(year) {
	if (year <= 2006) {
		return 60;
	} else if (year <= 2011 && year > 2006) {
		return 78;
	} else if (year <= 2016 && year > 2011) {
		return 81.5;
	}
}

function heatToWatt(heatingEfficiency, state, squarefootage) {

	var climateTemp = stateToClimateTemp(state);
	var tempDiff = 75 - climateTemp;
	var cubicFootage = squarefootage*9;
	
		var energy = (58*(cubicFootage/1000)*(tempDiff))/(heatingEfficiency/100);

	var days = convertStateToHeatTime(state);

	energy *= days;

	return energy;
}

function convertStateToHeatTime(state) {
	var zone = stateToZone(state);
	
	if(zone == 1) {
		return 365 - 299.43;
	} else if (zone == 2) {
		return 365 - 265.73;
	} else if (zone == 3) {
		return 365 - 247.89;
	} else if (zone == 4) {
		return 365 - 195.38;
	} else if (zone == 5) {
		return 365 - 176.25;
	}

}

function stateToClimateTemp(state) {
	console.log(state, states);
	for(var i = 0; i<climateTemps.length; i++) {
		if(state === states[i]) {
			return climateTemps[i];
		}
	}
	return("ERROR: Climate Temp not found");
}

function convertWattToCostHeater(watt, state) {
	var costConverter;

	for(i = 0; i<states.length; i++) {
		if(state == states[i]) {
			costConverter = costs[i];
		}
	}
	
	cost = (watt/1000) * (costConverter/100);

	return cost.toFixed(2);
}

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