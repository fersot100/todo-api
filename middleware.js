var cryptojs = require('crypto-js');
module.exports = function (db) {
	return {
		requireAuthentication: function(req, res, next) { //middleware has built in ways to handle params 
			var token = req.get('Auth') || ''; //Add an empty string in case it fails 
			db.token.findOne({
				where: {
					tokenHash: cryptojs.MD5(token).toString()
				}
			}).then(function (tokenInstance){
				if (!tokenInstance){
					throw new Error();
				}

				req.token = tokenInstance;
				return db.user.findByToken(token);

			}).then(function(user) {
				req.user = user;
				next();
			}).catch(function(){
				res.status(401).send();
			})
			// db.user.findByToken(token).then(function (user){
			// 	req.user = user;
			// 	next();
			// }, function(){
			// 	res.status(401).send();
			// });
		}
	};
}