var express = require('express');
var session = require('express-session');

module.exports = {
	password: function(req, res) {
		var password = req.body.password;
		password = password.toLowerCase();
		var user = "visitor";
	  	if (!password || password !== 'partytime') {
	  		console.log('wrong password');
	    	res.send('401');
	  	} else if (password === 'partytime') {
	    	req.session.user = 'visitor';
	    	req.session.admin = true;
	    	res.send( { redirect: '/' } );
	  	}
	}
};
