function main() {
}
main();

function convertYearToEfficiency(year) {
	if (year <= 2006) {
		return 60;
	} else if (year <= 2011 && year > 2006) {
		return 78;
	} else if (year <= 2016 && year > 2011) {
		return 81.5;
	}
}

function calcTotalCostHeater(state, year, squarefootage) {
	return convertWattToCostHeater(heatToWatt(convertYearToEfficiency(year), state, squarefootage), state);
}

function calcTotalCostEfficiency(state, efficiency, squarefootage) {
	return convertWattToCostHeater(heatToWatt(efficiency, state, squarefootage), state);
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
	for(var i = 0; i<climateTemps.length; i++) {
		if(state === states[i]) {
			return climateTemps[i];
		}
	}
	return("ERROR: climate temperature not found!");
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

function calcTotalCarbonEfficiency(state, SEER, squarefootage) {
	var watt = convertSEERtoWatt(SEER, stateToZone(state), squarefootage);
	var carbon = (watt/1000)*2;
	return carbon;
}

function calcTotalCarbonYearHeater(state, year, squarefootage) {
	var efficiency = convertYearToEfficiency(year);
	return calcTotalCarbonEfficiency(state, efficiency, squarefootage);
}