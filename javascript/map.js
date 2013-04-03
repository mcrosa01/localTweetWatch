var geocoder;
var map;

initialize = function() {
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(-34.397, 150.644);
	var mapOptions = {
		center: latlng,
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
	}
	
	map = new google.maps.Map(document.getElementById("map-canvas"),
		mapOptions)
		
	// var marker = new google.maps.Marker({
		// position: new google.maps.LatLng(37.791157,-122.408720),
		// map: map,
		// title: 'Click to zoom'
	// });	
	
	//google.maps.event.addListener(marker, 'click', function() {
		//HIGH LIGHT THE TWEET ASSOCIATED WITH THAT MARKER
  	//});
}

function codeAddress() {
	var address = document.getElementById('address').value;
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			getTweets();
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}

function getTweets() {
	console.log(map.getCenter())
}

google.maps.event.addDomListener(window, 'load', initialize)