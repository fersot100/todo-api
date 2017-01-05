var cryptojs = require('crypto-js');

module.exports = function(sequelize, DataTypes){

	return sequelize.define('token', {
		token: {
			type: DataTypes.VIRTUAL, //Only used for validation
			allowNull: false,
			validate: {
				len: [1] //Length greater than one
			},
			set: function(value){ //This is a funciton override similiarly used in user.js
				var hash = cryptojs.MD5(value).toString();
				this.setDataValue('token', value);
				this.setDataValue('tokenHash', hash);
			}
		},
		tokenHash: DataTypes.STRING
	});

};