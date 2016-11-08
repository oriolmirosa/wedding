var express = require('express'),
	session = require('express-session'),
	router = express.Router(),
	scripts = require('../controllers/scripts'),
	registry = require('../controllers/registry'),
	i18n = require('i18n'),
	rsvp = require('../controllers/rsvp');

module.exports = function(app) {

	router.get('*',function(req, res, next){
	  if(req.headers['x-forwarded-proto']!='https')
	    res.redirect('https://TheKarosas.com' + req.url)
	  else
	    next()
	})

	// Authentication and Authorization Middleware
	var auth = function(req, res, next) {
	   	if (req.session && req.session.user === "visitor" && req.session.admin) {
	    	return next();
	   	} else {
	    	return res.redirect('/login');
	   	}
	};

	const letsEncryptResponse = process.env.CERTBOT_RESPONSE;

	// Return the Let's Encrypt certbot response:
	router.get('/.well-known/acme-challenge/:content', function(req, res) {
	  res.send(letsEncryptResponse);
	});

	router.get('/login', function (req, res) {
		console.log(res.__('Hello i18n'));
		res.render('login', {layout: 'empty.handlebars'});
	});
	router.get('/', auth, function(req, res) {
		console.log("Cookies :  ", req.cookies);
		res.render('index');
	});
	router.get('/faq', auth, function(req, res) {
		res.render('faq');
	});
	router.get('/travel', auth, function(req, res) {
		res.render('travel');
	});
	router.get('/events', auth, function(req, res) {
		res.render('events');
	});

	router.get('/language', function (req, res) {
		i18n.setLocale(req, req.query.lang);
		console.log('req.query.lang: ' + req.query.lang)
  		res.cookie('gmlang', req.query.lang, { maxAge: 1000000, httpOnly: false });
  		console.log('cookies set, sending the new language back');
  		res.send(req.query.lang);
	});

	router.get('/rsvp', auth, rsvp.index);
	router.get('/registry', auth, registry.index);
	router.post('/passwordsite', scripts.password);
	router.get('/registry/create', auth, registry.create);
	router.post('/createitem', registry.createItem);
	router.post('/updateitem', registry.updateItem);
	router.post('/deleteitem', registry.deleteItem);
	router.post('/givesession', registry.giveSession);
	router.get('/rsvp/guests', auth, rsvp.guests);
	router.get('/rsvp/summary', auth, rsvp.summary);
	router.post('/newguest', rsvp.newGuests);
	router.post('/updateguests', rsvp.updateGuests);
	router.post('/deleteguests', rsvp.deleteGuests);
	router.get('/searchguests', rsvp.searchGuests);
	router.get('/updateguestsbythem', rsvp.updateGuestsByThem);
	router.post('/sendemail', rsvp.sendEmail);

	app.use(router);
};
