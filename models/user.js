var bcrypt = require('bcrypt');
var _ = require('underscore');
var crypto = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function (sequelize, DataTypes) {
	var user = sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		salt: {
			type: DataTypes.STRING
		}, 
		password_hash:{
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [7,100]
			},
			set: function(value){
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value, salt);
				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPassword);
			}
		}
	},{
		hooks: {
			beforeValidate: function(user, options){
				// user.email
				if (typeof user.email === 'string'){
					user.email = user.email.toLowerCase();
				}
			}
		},
		classMethods: {
			authenticate: function(body) {
				return new Promise(function(resolve, reject) {	
					if(typeof body.email !== 'string' || typeof	body.password !== 'string'){
						reject('invalid attribute type');
					}
					user.findOne({
						where: {
							email: body.email
						}
					}).then(function(user){
						if(!user || 
							!bcrypt.compareSync(body.password, user.get('password_hash'))){
							reject('password doesn\'t match or no user');
						}
						resolve(user);
					},function(e){
						reject(e);
					});
				});
			}
		},
		instanceMethods:{
			toPublicJSON: function () {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email');
			},
			generateToken: function(type) {
				if(!_.isString(type)){
					return undefined;
				}

				try{
					var stringData = JSON.stringify({id: this.get('id'), type: type});
					var encryptedData = crypto.AES.encrypt(stringData, 'abc123!@#').toString();
					var 
				}catch(e){
					return undefined;
				}
			}
		}
	});
	return	user;
};