initialize = function() {
	var mapOptions = {
		center: new google.maps.LatLng(37.781157,-122.398720),
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var map = new google.maps.Map(document.getElementById("map-canvas"),
		mapOptions)
		

//the following is stuff from the Google tutorial.
	var marker = new google.maps.Marker({
	//*************************************************Notes*******************
	// this is the options to include, the LatLng would be recieved from the Tweets
	// Since I can't figure out how exactly to set the numbers different...
	// What if when you click on a marker it changes the color of that tweet? 
	// I think I could manage that. 
		position: new google.maps.LatLng(37.791157,-122.408720),
		map: map,
		title: 'Click to zoom'
	});	
	google.maps.event.addListener(map, 'center_changed', function() {
	    // 3 seconds after the center of the map has changed, pan back to the
	    // marker.
	    window.setTimeout(function() {
	      map.panTo(marker.getPosition());
	    }, 3000);
	});
	google.maps.event.addListener(marker, 'click', function() {
		map.setZoom(8);
		map.setCenter(marker.getPosition());
  	});
}
google.maps.event.addDomListener(window, 'load', initialize)

coords = function() {
	map = google.maps.Map
	var currentLatLng = true

	return currentLatLng
}
