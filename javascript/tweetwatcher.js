var since_id = "";


/**
 * Takes a Longitude, latitude and radius of the Tweet search and adds all the 
 * tweets returned by the twitter search api in the div element called 'twitterfeed'
 *  
 * @param {Number} longitude - A double precision number
 * @param {Number} latitude - A double precision number
 * @param {Number} radius - An integer
 */
function getTweets(longitude, latitude, radius) {
	//Get the Long, Lat, and radius
	var coords = longitude + "," + latitude + "," + radius + "mi"
	if (coords === "") {
		coords = "37.781157,-122.398720,1mi";
	}

	//Get the data based on the given coordinates.
	if (since_id !== ""){
		var url = "http://search.twitter.com/search.json?geocode=" + coords + "&since_id=" + since_id + "&callback=?";
	}
	else{
		var url = "http://search.twitter.com/search.json?geocode=" + coords + "&callback=?";
	}
	$.getJSON(url, function(json) {
		//console.log(json);
		//Get the twitter feed div
		var tfeed = document.getElementById("twitterfeed");
		//Clear current tweets
		tfeed.innerHTML = "url:" + url + "<br/>since_id:" + since_id;

		//Get the tweets from the response data
		data = eval(json);
		//Set the since_id
		since_id = data['max_id_str'];
		
		//Process the tweets
		tweets = data['results'];
		for (var i = 0; i < tweets.length; i++) {
			var tweet = document.createElement("p");
			tweet.className = "tweet";
			tweet.innerHTML = tweets[i].text + "<br/>-" + tweets[i].from_user_name;
			tfeed.appendChild(tweet)
		}
	});
}

