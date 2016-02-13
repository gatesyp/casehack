"use strict";

var express = require("express"),
	config = require("./config.json"),
	twitterAPI = require("node-twitter-api"),
	twitter = new twitterAPI({
		consumerKey: config.twitter.consumer_key,
		consumerSecret: config.twitter.consumer_secret,
		callback: config.twitter.callback
	}), requestSecrets = {};

var app = express();
app.get("/twitter-signin", function(req, res) {
	twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
		requestSecrets[requestToken] = requestTokenSecret;
		res.send('<meta http-equiv="refresh" content="0;url=https://api.twitter.com/oauth/authenticate?oauth_token=' + requestToken + '">');
	});
});
app.get("/twitter-callback", function(req, res) {
	if (!req.query.oauth_token || !requestSecrets[req.query.oauth_token] || !req.query.oauth_verifier) {
		res.send('invalid oauth_token or oauth_verifier');
		return false;
	}
	twitter.getAccessToken(req.query.oauth_token, requestSecrets[req.query.oauth_token],
		req.query.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
		if (error) {
			res.send('failed to get access token');
			return false;
		}
		var data = new Buffer(JSON.stringify({
			accessToken: accessToken,
			accessTokenSecret: accessTokenSecret,
			name: results.screen_name,
			uid: results.user_id
		})).toString('base64');
		res.send('<meta http-equiv="refresh" content="0;url=chrome://extensions/efjnbebhdpcneehmadobijcjfibakdee/callback/twitter.html?_=' + encodeURIComponent(data) + '">');
	});
});

app.listen(config.server.port, function () {
	console.log("Listening on " + config.server.port + "...");
});
