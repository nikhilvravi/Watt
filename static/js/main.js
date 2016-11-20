function viewSavings() {
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
	document.getElementById('acUnitText').innerHTML = acUnitStr;

	
}