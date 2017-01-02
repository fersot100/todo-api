module.exports = function (db) {
	return {
		requireAuthentication: function(req, res, next) { //middleware has built in ways to handle params 
			var token = req.get('Auth');
			db.user.findByToken(token).then(function (user){
				req.user = user;
				next();
			}, function(){
				res.status(401).send();
			});
		}
	};
}