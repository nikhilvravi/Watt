var names = [];
var ton = [];
var seer = [];
var price = [];
var vendor = [];
var model = [];
var url = [];

function viewSavings() {
	$.get("../static/data/acUnitData.csv", function(data) {
		var temp = data.split('\n');
		for(var i=1; i<temp.length; i++) {
			var temp2 = temp[i].split(',');
			names.push(temp2[0]);
			ton.push(parseInt(temp2[1]));
			seer.push(parseInt(temp2[2]));
			price.push(parseFloat(temp2[3]));
			vendor.push(temp2[4]);
			model.push(temp2[5]);
			url.push(temp2[6]);
		}
		helper();
	});
}

function helper() {
	var state = document.getElementById('autocomplete').value.split(", ")[0].toLowerCase();
	var numOfPpl = parseInt(document.getElementById('household-size').value);
	var remYears = parseInt(document.getElementById('years').value);
	var sqFeet = parseInt(document.getElementById('sqft').value);
	var acManf = document.getElementById('acUnit').value;
	var acYear = parseInt(document.getElementById('acUnitYear').value);
	var heatManf = document.getElementById('heatingUnit').value;
	var heatYear = parseInt(document.getElementById('heatingUnitYear').value);
	var microwaveManf = document.getElementById('microwave').value;
	var microwaveYear = parseInt(document.getElementById('microwaveYear').value);
	var fridgeManf = document.getElementById('fridge-freezer').value;
	var fridgeYear = parseInt(document.getElementById('fridge-freezerYear').value);

	var currCostPerYear = calcTotalCost(state, acYear, sqFeet);
	var acUnitStr = document.getElementById('acUnitText').innerHTML;
	acUnitStr = acUnitStr.replace("[manufacturer]", acManf);
	acUnitStr = acUnitStr.replace("[year]", acYear);
	acUnitStr = acUnitStr.replace("[amount]", currCostPerYear);
	var currTotalCost = currCostPerYear*remYears;

	var bestMatches = [0, 0, 0];
	var bestMatchPrices = [currTotalCost, currTotalCost, currTotalCost];
	for(var i=0; i<names.length; i++) {
		if(ton[i]*600 >= sqFeet) {
			var newCostPerYear = calcTotalCostSEER(state, seer[i], sqFeet);
			var newTotalCost = price[i] + newCostPerYear*remYears;
			if(newTotalCost < bestMatchPrices[0]) {
				bestMatches[0] = i;
				bestMatchPrices[0] = newTotalCost;
			} else if(newTotalCost < bestMatchPrices[1]) {
				bestMatches[1] = i;
				bestMatchPrices[1] = newTotalCost;
			} else if(newTotalCost < bestMatchPrices[2]) {
				bestMatches[2] = i;
				bestMatchPrices[2] = newTotalCost;
			}
		}
	}

	if(bestMatchPrices[0] != currTotalCost) {
		acUnitStr = acUnitStr.replace("[should/should not]", "should");
		acUnitStr = acUnitStr.replace("buy", "<strong>buy</strong>");
		var yearsReq = (price[bestMatches[0]]/(currCostPerYear - calcTotalCostSEER(state, seer[bestMatches[0]], sqFeet))).toFixed(2);
		var carbonSaved = (calcTotalCarbonYear(state, acYear, sqFeet) - calcTotalCarbonSEER(state, seer[bestMatches[0]], sqFeet)).toFixed(0);
		var carbonPercent = ((1 - calcTotalCarbonSEER(state, seer[bestMatches[0]], sqFeet)/calcTotalCarbonYear(state, acYear, sqFeet))*100).toFixed(0);
		acUnitStr += "At best, you can break even (for cost) in <strong>" + yearsReq + " years</strong> and save <strong>" + carbonSaved + " pounds</strong> of carbon per year!";
		acUnitStr += " You saved <strong>" + carbonPercent + "%</strong> in carbon emissions, which is great!"

		document.getElementById('acUnitRows').innerHTML = "";
		var newRows = "";
		for(i=0; i<3; i++) {
			if(bestMatches[i] === 0) break;
			newRows += "<tr>";
			newRows += '<td class="text-left">' + model[bestMatches[i]] + '</td>';
			newRows += '<td class="text-left">$' + price[bestMatches[i]] + '</td>';
			newRows += '<td class="text-left">' + ton[bestMatches[i]] + ' tons ($' + calcTotalCostSEER(state, seer[bestMatches[i]], sqFeet) + '/year) </td>';
			newRows += '<td class="text-left">$' + ((currTotalCost-bestMatchPrices[i])/remYears).toFixed(2) + '</td>';
			newRows += '<td class="text-left"><a target="_blank" href="' + url[bestMatches[i]] + '" class="btn btn go-slide animated" data-animation="fadeIn" data-animation-delay="60">Purchase</a></td>';
			newRows += "</tr>";
		}
		document.getElementById('acUnitRows').innerHTML += newRows;
		acUnitStr += " Your top choices are:";
	} else {
		acUnitStr = acUnitStr.replace("[should/should not]", "should not");
		acUnitStr += " You have no choices.";
	}
	document.getElementById('acUnitText').innerHTML = acUnitStr;
}