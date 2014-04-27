var OAuth= require('oauth').OAuth;

var oa = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	"OnKKE9ylsJd925KU4shAJVyQB", //consumerkey
	"5iVJ5PtChY687OReCgGjOpQgMNGI3wVfI5LvnadSGFMR8h2NI2", //consumersecret
	"1.0",
	"http://yourdomain/auth/twitter/callback", //figure out the domain
	"HMAC-SHA1"
);
//create OAuth object and then request an oauth token 
app.get('/auth/twitter', function(req, res){  //Call to Twitter 
	oa.getOauthRequestToken(function(error, oauth_token, oauth_token_secret, results){
		if(error){
			//new Error (error.data)
			console.log(error);
			res.send ("something didn't work")
		}

		else {
			req.session.oauth = {};  //prompted to continue with authentication and be routed back to site
			req.session.oauth.token = oauth_token;
			console.log('oauth.token: ' + req.session.oauth.token);

			req.session.oauth.token_secret = oauth_token_secret;
			console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
			res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
	}
	});
});

app.get('/auth/twitter/callback', function(req, res, next){
		if (req.session.oauth){
			req.session.oauth.verifier = req.query.oauth_verifier;
			var oauth = req.session.oauth;

			oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier, 
				function(error, oauth_access_token, oauth_access_token_secret, results){
					if(error){
						console.log(error);
						res.send("yeah something broke");
					} else {
						req.session.oauth.access_token = oauth_access_token;
						req.session.oauth_token_secret = oauth_access_token_secret;
						console.log(results);
						res.send("worked.  nice one.");
					}
				}
				);

		} else
				next(new Error("you're not supposed to be here"))

});