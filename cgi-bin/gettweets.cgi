#!/usr/local/bin/python

from urlparse import parse_qs
import urllib2
import oauth2 as oauth
import os
import cgitb
cgitb.enable()

# Oauth keys and objects
consumer_key = "MYCPn4pDXAtziF7ZHuwiPw"
consumer_secret = "n3hqCi6YU6o8PJItVzGo4L49Jsjk5CWU8EfhNGO1VWU"
access_token_key = "1276561987-XupkvzW9PSkQX0IuFoM7ED6spx99Uw73og83ziU"
access_token_secret = "QVAiyMzmYs2GZac384MNCppJvzxjpoTqkzAZcx9sjQ"

oauth_token    = oauth.Token(key=access_token_key, secret=access_token_secret)
oauth_consumer = oauth.Consumer(key=consumer_key, secret=consumer_secret)
geocode = "geocode=37,-122,1mi"
since_id = ""
result_type = ""
count = ""
# Url and parameters
if 'QUERY_STRING' in os.environ:
    qs = parse_qs(os.environ['QUERY_STRING'])
    if 'geocode' in qs:
        geocode = "geocode=" + qs['geocode'][0]
        
    since_id = ""
    if 'since_id' in qs:
        since_id = "&since_id=" + qs['since_id'][0]
        
    result_type = ""
    if 'result_type' in qs:
        result_type = "&result_type=" + qs['result_type'][0]
        
    count = ""
    if 'count' in qs:
        count = "&count=" + qs['count'][0]
    
http_url = "https://api.twitter.com/1.1/search/tweets.json?" + geocode + since_id + result_type + count

#Https Handler
https_handler = urllib2.HTTPSHandler()

#Create a request object and sign it
req = oauth.Request.from_consumer_and_token(oauth_consumer,token=oauth_token,http_method="GET",http_url=http_url)
req.sign_request(oauth.SignatureMethod_HMAC_SHA1(), oauth_consumer, oauth_token)

#Setup the url Opener
opener = urllib2.OpenerDirector()
opener.add_handler(https_handler)


#Setup the URL request
headers = req.to_header()
request = urllib2.Request(http_url,headers=headers)

#Open the url
response = opener.open(request)
data = response.read()


#Return data
print "Content-type:application/json"
print "Access-Control-Allow-Origin: *"
print
print data
