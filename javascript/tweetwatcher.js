var since_id = "";
var coordlist = []


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
	if (!(longitude && latitude && radius)) {
		coords = "37.781157,-122.398720,1mi";
	}

	//Get the data based on the given coordinates.
	if (since_id !== ""){
		var url = "http://search.twitter.com/search.json?geocode=" + coords + "&include_entities=true&since_id=" + since_id + "&callback=?";
	}
	else{
		var url = "http://search.twitter.com/search.json?geocode=" + coords + "&include_entities=true&callback=?";
	}
	$.getJSON(url, function(json) {
		//console.log(json);
		//Get the twitter feed div
		var tfeed = document.getElementById("twitterfeed");
		//Clear current tweets
		tfeed.innerHTML = "url:" + url + "<br/>since_id:" + since_id;

		//Get the tweets from the response data
		data = eval('(' + json + ')');
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

function updateTwitterFeed(tweetsjson){
	//Get the twitter feed div
		var tfeed = document.getElementById("twitterfeed");
		//Clear current tweets
		tfeed.innerHTML = "since_id:" + since_id;

		//Get the tweets from the response data
		data = eval('(' + tweetsjson + ')');
		//Set the since_id
		since_id = data['max_id_str'];
		
		//Process the tweets
		tweets = data['statuses'];
		count = 0;
		coordlist = []
		for (var i = 0; i < tweets.length; i++) {
			var tweet = tweets[i]
			ttext = tweet.text;
			tauthor = tweet.user.screen_name;
			tcoords = tweet.coordinates;
			fcount = tweet.user.followers_count;
			acolor = fcount;
			if (acolor > 255){acolor = 255;}
			authortext = "-<span id=\'" + tauthor + "\'>" + tauthor + "</span>: " + fcount + " followers."
			var tweetdisplay = document.createElement("p");
			tweetdisplay.className = "tweet";
			displaystr = ""

			if (tcoords && tcoords.type === "Point"){
				var letter = String.fromCharCode(65+count);
				displaystr = letter+ "<br/>";
				coords = tcoords.coordinates;
				coordlist.push([letter, coords[0], coords[1]])
				count++;
			}
			displaystr += ttext + "<br/>" + authortext;
			tweetdisplay.innerHTML = displaystr
			tfeed.appendChild(tweetdisplay);
		}
		coordlist;
}


/**
 * Takes a Longitude, latitude and radius of the Tweet search and adds all the 
 * tweets returned by the twitter search api in the div element called 'twitterfeed'
 *  
 * @param {Number} longitude - A double precision number
 * @param {Number} latitude - A double precision number
 * @param {Number} radius - An integer
 * 
 * @return {Object} geocoords - Description
 */
function getTweetsGeo(longitude, latitude, radius) {
	
	var coords = longitude + "," + latitude + "," + radius + "mi";
	if (!(longitude && latitude && radius)) {
		//coords = "37.781157,-122.398720,1mi";
		coords = "41.577906,-93.745085,1mi";
	}
	
    var self = this;

    //var xmlHttpReq = false;
    var urlStr = "./cgi-bin/gettweets.cgi?geocode=" + coords;
    
    //$.getJSON(urlStr)
    
    
    // Mozilla/Safari
    if (window.XMLHttpRequest) {
        self.xmlHttpReq = new XMLHttpRequest();
    }
    // IE
    else if (window.ActiveXObject) {
        self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }
    self.xmlHttpReq.open('GET', urlStr, true);
    self.xmlHttpReq.setRequestHeader('Content-Type', 'application/json');
    self.xmlHttpReq.onreadystatechange = function() {
        if (self.xmlHttpReq.readyState == 4) {
            //alert("Data returned");
              updateTwitterFeed(self.xmlHttpReq.responseText);
        }
    }
    self.xmlHttpReq.send();
}
