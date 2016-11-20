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

	var bestMatch = 0;
	var bestMatchPrice = currTotalCost;
	for(var i=0; i<names.length; i++) {
		var newCostPerYear = calcTotalCostSEER(state, seer[i], sqFeet);
		var newTotalCost = price[i] + newCostPerYear*remYears;
		if(newTotalCost < bestMatchPrice) {
			bestMatch = i;
			bestMatchPrice = newTotalCost;
		}
	}

	if(bestMatchPrice != currTotalCost) acUnitStr = acUnitStr.replace("[should/should not]", "should");
	else acUnitStr.replace("[should/should not]", "should not");
	document.getElementById('acUnitText').innerHTML = acUnitStr;

	document.getElementById('acUnitRows').innerHTML = "";
	var newRow = "<tr>";
	newRow += '<td class="text-left">' + model[bestMatch] + '</td>';
	newRow += '<td class="text-left">$' + price[bestMatch] + '</td>';
	newRow += '<td class="text-left">' + ton[bestMatch] + ' tons ($' + calcTotalCostSEER(state, seer[bestMatch], sqFeet) + '/year) </td>';
	newRow += '<td class="text-left">$' + ((currTotalCost-bestMatchPrice)/remYears).toFixed(2) + '</td>';
	newRow += '<td class="text-left"><a target="_blank" href="' + url[bestMatch] + '" class="btn btn go-slide animated" data-animation="fadeIn" data-animation-delay="60">Purchase</a></td>';
	newRow += "</tr>";
	document.getElementById('acUnitRows').innerHTML += newRow;
}