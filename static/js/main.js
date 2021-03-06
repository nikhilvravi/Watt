var names = [];
var ton = [];
var seer = [];
var price = [];
var vendor = [];
var model = [];
var url = [];

var namesHeater = [];
var tonHeater = [];
var seerHeater = [];
var priceHeater = [];
var vendorHeater = [];
var modelHeater = [];
var urlHeater = [];

var state;
var numOfPpl;
var remYears;
var sqFeet;
var acManf;
var acYear;
var heatManf;
var heatYear;
var microwaveManf;
var microwaveYear;
var fridgeManf;
var fridgeYear;

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
        $.get("../static/data/heaterUnitData.csv", function(data2) {
            var temp = data2.split('\n');
            for(var i=1; i<temp.length; i++) {
                var temp2 = temp[i].split(',');
                namesHeater.push(temp2[0]);
                tonHeater.push(parseInt(temp2[1]));
                seerHeater.push(parseInt(temp2[2]));
                priceHeater.push(parseFloat(temp2[3]));
                vendorHeater.push(temp2[4]);
                modelHeater.push(temp2[5]);
                urlHeater.push(temp2[6]);
            }
            helper();
        });
    });
}

function helper() {
    state = document.getElementById('autocomplete').value.split(", ")[0].toLowerCase();
    numOfPpl = parseInt(document.getElementById('household-size').value);
    remYears = parseInt(document.getElementById('years').value);
    sqFeet = parseInt(document.getElementById('sqft').value);
    acManf = document.getElementById('acUnit').value;
    acYear = parseInt(document.getElementById('acUnitYear').value);
    heatManf = document.getElementById('heatingUnit').value;
    heatYear = parseInt(document.getElementById('heatingUnitYear').value);
    microwaveManf = document.getElementById('microwave').value;
    microwaveYear = parseInt(document.getElementById('microwaveYear').value);
    fridgeManf = document.getElementById('fridge-freezer').value;
    fridgeYear = parseInt(document.getElementById('fridge-freezerYear').value);

    acHelper();
    heaterHelper();
}

function acHelper() {
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
        acUnitStr += " You saved <strong>" + carbonPercent + "%</strong> in carbon emissions, which is great!";

        document.getElementById('acUnitRows').innerHTML = "";
        var newRows = "";
        for(i=0; i<3; i++) {
            if(bestMatches[i] === 0) break;
            newRows += '<tr>';
            newRows += '<td class="text-left">' + model[bestMatches[i]] + '</td>';
            newRows += '<td class="text-left">$' + price[bestMatches[i]] + '</td>';
            newRows += '<td class="text-left">' + ton[bestMatches[i]] + ' tons ($' + calcTotalCostSEER(state, seer[bestMatches[i]], sqFeet) + '/year) </td>';
            newRows += '<td class="text-left">$' + ((currTotalCost-bestMatchPrices[i])/remYears).toFixed(2) + '</td>';
            newRows += '<td class="text-left"><a target="_blank" href="' + url[bestMatches[i]] + '" class="btn btn go-slide animated fadeIn visible" data-animation="fadeIn" data-animation-delay="60">Purchase</a></td>';
            newRows += '</tr>';
        }
        document.getElementById('acUnitRows').innerHTML += newRows;
        console.log(document.getElementById('acUnitRows').innerHTML);
        acUnitStr += " Your top choices are:";
    } else {
        acUnitStr = acUnitStr.replace("[should/should not]", "should not");
        acUnitStr += " You have no choices.";
    }
    document.getElementById('acUnitText').innerHTML = acUnitStr;
}

function heaterHelper() {
    var currCostPerYear = calcTotalCostHeater(state, heatYear, sqFeet);
    var heaterUnitStr = document.getElementById('heaterUnitText').innerHTML;
    heaterUnitStr = heaterUnitStr.replace("[manufacturer]", heatManf);
    heaterUnitStr = heaterUnitStr.replace("[year]", heatYear);
    heaterUnitStr = heaterUnitStr.replace("[amount]", currCostPerYear);
    var currTotalCost = currCostPerYear*remYears;

    var bestMatches = [0, 0, 0];
    var bestMatchPrices = [currTotalCost, currTotalCost, currTotalCost];
    for(var i=0; i<namesHeater.length; i++) {
        if(tonHeater[i] >= sqFeet*25) {
            var newCostPerYear = calcTotalCostEfficiency(state, seerHeater[i], sqFeet);
            var newTotalCost = priceHeater[i] + newCostPerYear*remYears;
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
        heaterUnitStr = heaterUnitStr.replace("[should/should not]", "should");
        heaterUnitStr = heaterUnitStr.replace("buy", "<strong>buy</strong>");
        var yearsReq = (priceHeater[bestMatches[0]]/(currCostPerYear - calcTotalCostEfficiency(state, seerHeater[bestMatches[0]], sqFeet))).toFixed(2);
        var carbonSaved = (calcTotalCarbonYear(state, heatYear, sqFeet) - calcTotalCarbonEfficiency(state, seerHeater[bestMatches[0]], sqFeet)).toFixed(0);
        var carbonPercent = ((1 - calcTotalCarbonEfficiency(state, seerHeater[bestMatches[0]], sqFeet)/calcTotalCarbonYear(state, heatYear, sqFeet))*100).toFixed(0);
        heaterUnitStr += "At best, you can break even (for cost) in <strong>" + yearsReq + " years</strong> and save <strong>" + carbonSaved + " pounds</strong> of carbon per year!";
        heaterUnitStr += " You saved <strong>" + carbonPercent + "%</strong> in carbon emissions, which is great!";

        document.getElementById('heaterUnitRows').innerHTML = "";
        var newRows = "";
        for(i=0; i<3; i++) {
            if(bestMatches[i] === 0) break;
            newRows += '<tr>';
            newRows += '<td class="text-left">' + modelHeater[bestMatches[i]] + '</td>';
            newRows += '<td class="text-left">$' + priceHeater[bestMatches[i]] + '</td>';
            newRows += '<td class="text-left">' + tonHeater[bestMatches[i]] + ' BTU ($' + calcTotalCostEfficiency(state, seerHeater[bestMatches[i]], sqFeet) + '/year) </td>';
            newRows += '<td class="text-left">$' + ((currTotalCost-bestMatchPrices[i])/remYears).toFixed(2) + '</td>';
            newRows += '<td class="text-left"><a target="_blank" href="' + urlHeater[bestMatches[i]] + '" class="btn btn go-slide animated fadeIn visible" data-animation="fadeIn" data-animation-delay="60">Purchase</a></td>';
            newRows += '</tr>';
        }
        document.getElementById('heaterUnitRows').innerHTML += newRows;
        heaterUnitStr += " Your top choices are:";
    } else {
        heaterUnitStr = heaterUnitStr.replace("[should/should not]", "should not");
        heaterUnitStr += " You have no choices.";
    }
    document.getElementById('heaterUnitText').innerHTML = heaterUnitStr;
}