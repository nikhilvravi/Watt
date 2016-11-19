var startDate, endDate, startString, endString, lastTime, leaveTime;
var months = 6;
var budget = 0;

function planTrip() {
  if(document.getElementById("months").value.replace(/^\s+|\s+$/g, '') !== "") months = parseInt(document.getElementById("months").value.replace(/^\s+|\s+$/g, ''));
  budget = savings*months;
  if(document.getElementById("percent").value.replace(/^\s+|\s+$/g, '') !== "") budget *= parseFloat(document.getElementById("percent").value.replace(/^\s+|\s+$/g, ''))/100;
  if(document.getElementById("manual").value.replace(/^\s+|\s+$/g, '') !== "") budget = parseInt(document.getElementById("manual").value.replace(/^\s+|\s+$/g, ''));
  if(!destination) alert("Nowhere to go!");
  else if(!document.getElementById("start-date").value.replace(/^\s+|\s+$/g, '').match(/(\d{2}\/){2}\d{4}/)) alert("Provide a valid start date!");
  else if(!document.getElementById("end-date").value.replace(/^\s+|\s+$/g, '').match(/(\d{2}\/){2}\d{4}/)) alert("Provide a valid end date!");
  else {
    startDate = document.getElementById("start-date").value.replace(/^\s+|\s+$/g, '');
    endDate = document.getElementById("end-date").value.replace(/^\s+|\s+$/g, '');
    startString = startDate.substring(6, 10) + "-" + startDate.substring(0, 2) + "-" + startDate.substring(3, 5);
    endString = endDate.substring(6, 10) + "-" + endDate.substring(0, 2) + "-" + endDate.substring(3, 5);
    document.getElementById("rows").innerHTML = "";
    findFlight();
  }
}

function removeRow(element) {
  element.parentElement.parentElement.innerHTML = "";
}

function asString(date) {
  return((date.getMonth()+1).toString() + "/" + date.getDate().toString() + "/" + date.getFullYear().toString());
}

function getRandomInt(min, max) {
  return Math.floor(Math.random()*(max - min + 1) + min);
}

function addMinutes(time, minutes) {
  dayMinutes = parseInt(time.substring(0, 2))*60 + parseInt(time.substring(3, 5)) + minutes;
  hour = parseInt(dayMinutes/60);
  if(hour < 10) hour = "0" + hour;
  min = parseInt(dayMinutes%60);
  if(min < 10) min = "0" + min;
  return(hour + ":" + min);
}

function subtractMinutes(time, minutes) {
  dayMinutes = parseInt(time.substring(0, 2))*60 + parseInt(time.substring(3, 5)) - minutes;
  hour = parseInt(dayMinutes/60);
  if(hour < 10) hour = "0" + hour;
  min = parseInt(dayMinutes%60);
  if(min < 10) min = "0" + min;
  return(hour + ":" + min);
}

function daysBetween(firstDate, secondDate) {
  var oneDay = 24*60*60*1000;
  return(Math.round(Math.abs(((new Date(firstDate)).getTime() - (new Date(secondDate)).getTime())/(oneDay))));
}

function formatDate(dateString) {
  return(dateString.substring(dateString.indexOf("T")+1, dateString.lastIndexOf("-")));
}

function addToTable(data) {
  var str = "";
  str += "<tr><td class='text-left'>" + data[0] + "</td>";
  str += "<td class='text-left'>" + data[1] + "</td>";
  str += "<td class='text-left'><a href=\"" + data[4] + "\">" + data[2] + "</a></td>";
  str += "<td class='text-left'>" + data[3] + "</td>";
  str += "<td class='text-left'><a href='#' class='btn btn' onclick='removeRow(this)'>Remove</a></td></tr>";
  document.getElementById("rows").innerHTML += str;
}

function findFlight() {
  var airportFrom = "DTW"; //Always starting from Detroit
  var cityTo = destination.address_components[0].long_name;
  var url = "http://iatacodes.org/api/v4/autocomplete?api_key=1c5694b4-90da-4e17-89b1-12862c708769&query=" + cityTo;
  $.get(url, function(data) {
    longitude = data.response.airports_by_cities[0]["lng"];
    latitude = data.response.airports_by_cities[0]["lat"];
    airportTo = data.response.airports_by_cities[0]["code"];
    var passInfo = {
      "request": {
        "slice": [
  {
    "origin": airportFrom,
    "destination": airportTo,
    "date": startString
  },
    {
      "origin": airportTo,
    "destination": airportFrom,
    "date": endString
    }
  ],
    "passengers": {
      "adultCount": 1,
    "infantInLapCount": 0,
    "infantInSeatCount": 0,
    "childCount": 0,
    "seniorCount": 0
    },
    "solutions": 1,
    "refundable": false
      }
    };
    var request = $.ajax({
      url: "https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyAoDBC4lSlOWR1Lf2aJzBKTrLm7eaBM9-4",
        data: JSON.stringify(passInfo),
        contentType: "application/json",
        async: true,
        type: "POST"
    });
    request.complete(function(data) {
      var departureTime1 = formatDate(data["responseJSON"]["trips"]["tripOption"][0]["slice"][0]["segment"][0]["leg"][0]["departureTime"]);
      var arrivalTime1 = formatDate(data["responseJSON"]["trips"]["tripOption"][0]["slice"][0]["segment"][0]["leg"][0]["arrivalTime"]);
      var startTime = departureTime1 + " to " + arrivalTime1;
      lastTime = arrivalTime1;
      var departureTime2 = formatDate(data["responseJSON"]["trips"]["tripOption"][0]["slice"][1]["segment"][0]["leg"][0]["departureTime"]);
      var arrivalTime2 = formatDate(data["responseJSON"]["trips"]["tripOption"][0]["slice"][1]["segment"][0]["leg"][0]["arrivalTime"]);
      var endTime = departureTime2 + " to " + arrivalTime2;
      leaveTime = departureTime2;
      var name1 = airportFrom + " to " + airportTo + " (" + data["responseJSON"]["trips"]["tripOption"][0]["slice"][0]["segment"][0]["flight"]["carrier"] + data["responseJSON"]["trips"]["tripOption"][0]["slice"][0]["segment"][0]["flight"]["number"] + ")";
      var name2 = airportTo + " to " + airportFrom + " (" + data["responseJSON"]["trips"]["tripOption"][0]["slice"][1]["segment"][0]["flight"]["carrier"] + data["responseJSON"]["trips"]["tripOption"][0]["slice"][1]["segment"][0]["flight"]["number"] + ")";
      var price = parseInt(data["responseJSON"]["trips"]["tripOption"][0]["pricing"][0]["saleTotal"].substring(3))/2;

      budget = budget - 2*price;
      addToTable([startDate, startTime, name1, price, ""]);
      findHotel(longitude, latitude);
      addToTable([endDate, endTime, name2, price, ""]);
    });
  });
}

function findHotel(longitude, latitude) {
  var request = $.ajax({
    headers: {'Authorization': 'expedia-apikey key=7FAbOxAd03MKVCTusLDiGQ9irDkzX6F9'},
      url: "http://terminal2.expedia.com:80/x/hotels?maxhotels=500&location="+latitude+"%2C"+longitude+"&radius=10km&checkInDate="+startString+"&checkOutDate="+endString+"&adults=1&sort=starrating&order=desc&exclude=description%2Caddress%2Cthumbnailurl%2Camenitylist%2Cgeolocation",
      async: false,
      type: "GET"
  });
  request.complete(function(data) {
    var allocated = budget*0.25;
    var output = [];
    var days = daysBetween(startString, endString);
    for(var i=0; i<data["responseJSON"]["HotelCount"]; i++) {
      if(parseInt(data["responseJSON"]["HotelInfoList"]["HotelInfo"][i]["StatusCode"]) != 1) {
        if(parseInt(data["responseJSON"]["HotelInfoList"]["HotelInfo"][i]["Price"]["TotalRate"]["Value"])*days <= allocated) {
          output = [
    startDate,
    addMinutes(lastTime, 60) + " to " + addMinutes(lastTime, 90),
    "Check-in: " + data["responseJSON"]["HotelInfoList"]["HotelInfo"][i]["Name"],
    parseInt(data["responseJSON"]["HotelInfoList"]["HotelInfo"][i]["Price"]["TotalRate"]["Value"])*days,
    data["responseJSON"]["HotelInfoList"]["HotelInfo"][i]["DetailsUrl"]
    ];
  break;
        }
      }
    }
    lastTime = addMinutes(lastTime, 90);
    addToTable(output);
    output[0] = endDate;
    output[1] = subtractMinutes(leaveTime, 90) + " to " + subtractMinutes(leaveTime, 60);
    output[2] = output[2].replace("Check-in", "Check-out");
    budget = budget - output[3];
    output[3] = 0;
    findFoodandEvents(longitude, latitude);
    addToTable(output);
  });
}

function findFoodandEvents(longitude, latitude) {
  var url = "https://api.foursquare.com/v2/venues/search?ll=" + (latitude+0.1) + "," + (longitude+0.1) + "&client_id=KFSYUBEFSIF4BWHQN4WKWRX1MGGWQWO12BF5AZ0T12AGK1AL&client_secret=HSCRFAHT3DLO1SREGJ2HRP5OPQIN53IS5P4L0FL5432YICQO&v=20160221";
  var request = $.ajax({
    url: url,
      async: false,
      type: "GET"
  });
  request.complete(function(data) {
    var listOfVenues = data.responseJSON.response.venues;
    var events = [];
    for(var i=0; i<listOfVenues.length; i++) {
        events.push(listOfVenues[i]);
    }

    //first day
    //lunch (1 hr)
    lastTime = addMinutes(lastTime, 60);
    var current = new Date(parseInt(startDate.substring(6, 10)), parseInt(startDate.substring(0, 2))-1, parseInt(startDate.substring(3, 5)), parseInt(lastTime.substring(0, 2)), parseInt(lastTime.substring(3, 5)));
    if(current.getHours() < 14) {
      time = current.getHours().toString() + ":" + current.getMinutes().toString() + " to " + (current.getHours()+1).toString() + ":" + current.getMinutes().toString();
      var ev = events.pop();
      addToTable([asString(current), time, ev.name + " (Lunch)", "Unknown", ev.url]);
      lastTime = addMinutes(lastTime, 120);
      current = new Date(parseInt(startDate.substring(6, 10)), parseInt(startDate.substring(0, 2))-1, parseInt(startDate.substring(3, 5)), parseInt(lastTime.substring(0, 2)), parseInt(lastTime.substring(3, 5)));
    }

    //activity (5 hrs)
    if(current.getHours() < 16) {
      time = current.getHours().toString() + ":" + current.getMinutes().toString() + " to " + (current.getHours()+5).toString() + ":" + current.getMinutes().toString();
      ev = events.pop();
      addToTable([asString(current), time, ev.name + " (Activity)", "Unknown", ev.url]);
      lastTime = addMinutes(lastTime, 360);
      current = new Date(parseInt(startDate.substring(6, 10)), parseInt(startDate.substring(0, 2))-1, parseInt(startDate.substring(3, 5)), parseInt(lastTime.substring(0, 2)), parseInt(lastTime.substring(3, 5)));
    }

    //dinner (1 hr)
    if(current.getHours() < 22) {
      time = current.getHours().toString() + ":" + current.getMinutes().toString() + " to " + (current.getHours()+1).toString() + ":" + current.getMinutes().toString();
      ev = events.pop();
      addToTable([asString(current), time, ev.name + " (Dinner)", "Unknown", ev.url]);
    }	
    current.setDate(current.getDate() + 1);

    //days in between
    var last = new Date(parseInt(endDate.substring(6, 10)), parseInt(endDate.substring(0, 2))-1, parseInt(endDate.substring(3, 5)));
    while((new Date(current.getFullYear(), current.getMonth(), current.getDate())).getTime() < last.getTime()) {
      var hr = getRandomInt(11, 14);

      //lunch (1 hr)
      time = hr.toString() + ":00 to " + (hr+1).toString() + ":00";
      ev = events.pop();
      addToTable([asString(current), time, ev.name + " (Lunch)", "Unknown", ev.url]);

      //activity (5 hrs)
      time = (hr+2).toString() + ":00 to " + (hr+7).toString() + ":00";
      ev = events.pop();
      addToTable([asString(current), time, ev.name + " (Activity)", "Unknown", ev.url]);

      //dinner (1 hr)
      time = (hr+8).toString() + ":00 to " + (hr+9).toString() + ":00";
      ev = events.pop();
      addToTable([asString(current), time, ev.name + " (Dinner)", "Unknown", ev.url]);

      current.setDate(current.getDate() + 1);
    }
  });
}
