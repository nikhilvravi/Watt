// Foursquare
var findVenues = "https://api.foursquare.com/v2/venues/search?ll=" + latitude + "," + longitude + "&client_id=KFSYUBEFSIF4BWHQN4WKWRX1MGGWQWO12BF5AZ0T12AGK1AL&client_secret=HSCRFAHT3DLO1SREGJ2HRP5OPQIN53IS5P4L0FL5432YICQO&v=20160221"
var request = $.ajax({
  url: findVenues,
  async: true,
  type: "GET"
});

request.complete(function(data) {
  var listOfVenues = data.response.venues;
  var restaurants = [];
  var events = [];
  for (var i = 0; i < listOfVenues.length; i++) {
    if ((listOfVenues[i].categories[0].name).indexOf("Restaurant") > -1) {
      restaurants.push(listOfVenues[i];
    } else {
      events.push(listOfVenues[i]);
    }
  }
});
