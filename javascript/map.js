var geocoder;
var map;
var markers = new Array();

initialize = function() {
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(-34.397, 150.644);
	var mapOptions = {
		center : latlng,
		zoom : 8,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
	}

	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions)

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
	geocoder.geocode({
		'address' : address
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			map.setZoom(13);
			lookForTweets();
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}

// Deletes all markers in the array by removing references to them
function deleteMarkers() {
	if (markers) {
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
		markers.length = 0;
	}
}

//Clears the highlighting on all the tweets in the feed.
clearHighlights = function() {
	tweets = document.getElementsByClassName("tweet");
	for (var i = 0; i < tweets.length; i++) {
		tweets[i].style.backgroundColor = 'white';
	}
}
function placeTweetMarkers(coordlist) {
	// Google Map Custom Marker Maker 2012
	// Please include the following credit in your code

	// Sample custom marker code created with Google Map Custom Marker Maker
	// http://powerhut.co.uk/googlemaps/custom_markers.php
	var image = new google.maps.MarkerImage('images/marker-images/image.png', new google.maps.Size(29, 34), new google.maps.Point(0, 0), new google.maps.Point(15, 34));
	var shadow = new google.maps.MarkerImage('images/marker-images/shadow.png', new google.maps.Size(49, 34), new google.maps.Point(0, 0), new google.maps.Point(15, 34));
	var shape = {
		coord : [26, 0, 27, 1, 28, 2, 28, 3, 28, 4, 28, 5, 28, 6, 28, 7, 28, 8, 28, 9, 28, 10, 28, 11, 28, 12, 28, 13, 28, 14, 28, 15, 28, 16, 28, 17, 28, 18, 28, 19, 28, 20, 28, 21, 28, 22, 28, 23, 28, 24, 28, 25, 28, 26, 28, 27, 27, 28, 24, 29, 15, 30, 15, 31, 17, 32, 15, 33, 13, 33, 12, 32, 10, 31, 8, 30, 3, 29, 1, 28, 0, 27, 0, 26, 0, 25, 0, 24, 0, 23, 0, 22, 0, 21, 0, 20, 0, 19, 0, 18, 0, 17, 0, 16, 0, 15, 0, 14, 0, 13, 0, 12, 0, 11, 0, 10, 0, 9, 0, 8, 0, 7, 0, 6, 0, 5, 0, 4, 0, 3, 0, 2, 1, 1, 2, 0, 26, 0],
		type : 'poly'
	};

	//Remove all current markers
	deleteMarkers();

	//Add the new/current markers
	for (var i = 0; i < coordlist.length; i++) {

		var point = new google.maps.LatLng(coordlist[i][1], coordlist[i][2]);

		var marker = new google.maps.Marker({
			draggable : false,
			raiseOnDrag : false,
			icon : image,
			shadow : shadow,
			shape : shape,
			map : map,
			position : point
		});

		funcmaker = function(letter) {
			return function() {
				clearHighlights();
				li = document.getElementById(letter)
				div = li.getElementsByClassName("tweet")[0];
				div.style.backgroundColor = '#D4EDFA';
				a = document.createElement("a");
				a.href = "#" + letter;
				a.click();
			};
		}

		markers.push(marker);
		google.maps.event.addListener(marker, 'mouseover', funcmaker(coordlist[i][0]));
		google.maps.event.addListener(marker, 'mouseout', clearHighlights);
	}
}

function lookForTweets() {
	bd.getTweetsAndUpdateFeed(map.getCenter().lat(), map.getCenter().lng(), 1)
}

google.maps.event.addDomListener(window, 'load', initialize)