CircularBuffer = function(size) {
	var buffer = new Array();
	var end = 0;
	var maxsize = undefined;
	if(size){
		maxsize = size;
	}else{
		maxsize = 10;
	}

	this.write = function(item) {
		buffer[end] = item;
		end = (end + 1) % maxsize;
	}

	this.getBuffer = function() {
		if (buffer.length !== maxsize) {
			return buffer;
		} else {
			var newarr = new Array();
			for (var i = 0; i < maxsize; i++) {
				endi = (end + i) % maxsize;
				newarr.push(buffer[endi])
			}
			return newarr;
		}
	}

	this.clearBuffer = function() {
		buffer = new Array();
		end = 0;
	}
}
BirdWatcher = function(feeddisplay, numoftweets) {
	this.since_id = "";
	this.coordlist = [];
	this.numoftweets = 10;
	if (numoftweets) {this.numoftweets = numoftweets;}
	this.tweets = new CircularBuffer(this.numoftweets);
	this.feeddisplay = document.getElementById("twitterfeed");
	if (feeddisplay) {this.feeddisplay = feeddisplay;}
}

BirdWatcher.prototype.processTweets = function(tweetsjson) {
	//Get the tweets from the response data
	data = eval('(' + tweetsjson + ')');
	//Set the since_id
	this.since_id = data.search_metadata['max_id_str'];

	//Process the tweets
	tweets = data['statuses'];
	count = 0;
	this.coordlist = []
	for (var i = 0; i < tweets.length; i++) {
		var tweet = tweets[i]
		
		tcoords = tweet.coordinates;
		
		if (tcoords && tcoords.type === "Point") {
			tweet.letter = String.fromCharCode(65 + count);
			coords = tcoords.coordinates;
			this.coordlist.push([tweet.letter, coords[0], coords[1]])
			count++;
		}
		
		this.tweets.write(tweet);
	}
}

BirdWatcher.prototype.formatDate = function(time, isTitle){
	date = new Date(time);
	day = date.getDay();
	if(Number(day) < 10){day = "0" + day}
	if (isTitle){
		return day + " " + date.getMonth() + " " + date.getFullYear() + ", " + date.getHours() + ":" + date.getMinutes()
	}else{
		months = {0:'Jan',1:'Feb',2:'Mar',3:'Apr',4:'May',5:'Jun',
				  6:'Jul',7:'Aug',8:'Sep',9:'Oct',10:'Nov',11:'Dec',}
		if (date.getHours() > 12){amorpm = " PM - "}
		else{amorpm = " AM - "}
		return date.getHours()%12 + ":" + date.getMinutes() + amorpm + day + " " + 
				months[date.getMonth()] + " " + date.getFullYear().toString().substring(2,4);
	}
}

BirdWatcher.prototype.createStreamTweet = function(tweet) {
	user = tweet.user;
	return '\
	<li class="stream-item" >\
				<div class="tweet original-tweet">\
					<div class="content">\
						<div class="stream-item-header">\
							<a class="account-group" href="https://www.twitter.com/' + user.screen_name + '" >\
								<img class="avatar" src="' + user.profile_image_url_https + '" alt="' + user.screen_name + '">\
								<strong class="fullname show-popup-with-id">' + user.name + '</strong>\
								<span class="username"><s>@</s><b>' + user.screen_name + '</b></span>\
							</a>\
							<small class="time">\
								<a href="https://www.twitter.com/' + user.screen_name + '/status/' + tweet.id_str + '" class="tweet-timestamp" title="' + this.formatDate(tweet.created_at, true) + '">\
									<span class="_timestamp js-short-timestamp js-relative-timestamp" data-time="1364864453" data-long-form="true">3h</span>\
								</a>\
							</small>\
						</div>\
						<p class="">' + tweet.text + '</p>\
						<div class="footer customisable-border">\
							<span class="stats-narrow">\
								<span class="stats">\
									<span class="stats-retweets"> <strong>' + tweet.retweet_count + '</strong> Retweets </span>\
									<span class="stats-favorites"> <strong>' + tweet.favorite_count + '</strong> favorites </span>\
								</span>\
							</span>\
						</div>\
					</div>\
				</div>\
			</li>'
}

BirdWatcher.prototype.createTweetHTML = function(tweet) {
	user = tweet.user;
	return '\
	<div class="root standalone-tweet ltr not-touch" dir="ltr" id="twitter-widget-0" lang="en" data-twitter-event-id="0"> \
		<blockquote class="tweet subject expanded h-entry" data-tweet-id="' + tweet.id_str + '" cite="https://twitter.com/' + user.screen_name + '/status/' + tweet.id_str + '"> \
			<div class="header h-card p-author"> \
				<a class="u-url profile" href="https://twitter.com/' + user.screen_name + '" aria-label="' + user.name + ' (screen name: ' + user.screen_name + ')"> \
					<img class="u-photo avatar" alt="" src="' + user.profile_image_url_https + '" data-src-2x="https://si0.twimg.com/profile_images/993504415/css_bigger.png" width="48" height="48"> \
					<span class="full-name"> \
						<span class="p-name customisable-highlight">' + user.name + '</span> \
					</span> \
					<span class="p-nickname" dir="ltr">@<b>' + user.screen_name + '</b> </span> \
				</a> \
			</div> \
			<div class="e-entry-content"> \
				<p class="e-entry-title"> \
					' + tweet.text + ' <!-- <a href="http://t.co/7Gfcxp1n" dir="ltr" data-expanded-url="http://shar.es/qrZbO" class="link customisable" target="_blank" title="http://shar.es/qrZbO"><span class="tco-hidden">http://</span><span class="tco-display">shar.es/qrZbO</span><span class="tco-hidden"></span><span class="tco-ellipsis"><span class="tco-hidden">&nbsp;</span></span></a> via <a href="https://twitter.com/ShareThis" class="profile customisable h-card" dir="ltr">@<b class="p-nickname">sharethis</b></a> \
					Examine the html in this comment for an example on how to format a link--> \
				</p> \
				<div class="dateline"> \
					<a class="u-url customisable-highlight long-permalink" href="https://twitter.com/' + tweet.screen_name + '/statuses/' + tweet.id_str +'" data-datetime="' + tweet.created_at + '"> \
						<time pubdate="" class="dt-updated" datetime="' + new Date(tweet.created_at).toISOString() + '" title="Time posted: ' + this.formatDate(tweet.created_at,true) + '"> \
						' + this.formatDate(tweet.created_at, false) + ' \
						</time> \
					</a> \
				</div> \
			</div> \
		</blockquote> \
	</div>';
}

BirdWatcher.prototype.updateFeedDisplay = function() {
	//Clear current tweets
	//this.feeddisplay.innerHTML = "since_id:" + this.since_id;
	this.feeddisplay.innerHTML = ""
	tweets = this.tweets.getBuffer();
	for (var i = 0; i < tweets.length; i++) {
		var tweet = tweets[i]
		acolor = tweet.followers_count;
		if (acolor > 255) {
			acolor = 255;
		}
		var tweetdisplay = document.createElement("li");
		tweetdisplay.id = tweet.letter;
		tweetdisplay.class = "stream-item";
		//tweetdisplay.innerHTML = this.createTweetHTML(tweet);
		tweetdisplay.innerHTML = this.createStreamTweet(tweet);
		this.feeddisplay.appendChild(tweetdisplay);
	}
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
BirdWatcher.prototype.getTweetsAndUpdateFeed = function(longitude, latitude, radius) {

	var coords = longitude + "," + latitude + "," + radius + "mi";
	if (!(longitude && latitude && radius)) {
		//coords = "37.781157,-122.398720,1mi";
		coords = "41.577906,-93.745085,1mi";
	}

	var self = this;

	var urlStr = ""
	if (this.since_id != "") {
		var urlStr = "./cgi-bin/gettweets.cgi?geocode=" + coords + "&since_id=" + this.since_id + "&count=" + this.numoftweets;
	} else {
		var urlStr = "./cgi-bin/gettweets.cgi?geocode=" + coords + "&count=" + this.numoftweets;
	}

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
			//debugger;
			self.processTweets(self.xmlHttpReq.responseText);
			self.updateFeedDisplay();
		}
	}
	self.xmlHttpReq.send();
}
bd = undefined;

window.onload = function(){
	bd = new BirdWatcher(undefined, 5);
}

function getTweets(){
	var lat = document.getElementById("input-lat").value;
	var long = document.getElementById("input-long").value;
	var radius = document.getElementById("input-radius").value;
	bd.getTweetsAndUpdateFeed(long, lat, radius);
}
