var path = require('path'),
	routes = require('./routes'),
	exphbs = require('express-handlebars'),
	express = require('express'),
	session = require('express-session'),
	methodOverride = require('method-override'),
	multer = require('multer'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	i18n = require('i18n');

i18n.configure({
  locales:['en', 'ca'],
  directory: __dirname + '/locales',
  defaultLocale: 'en',
  queryParameter: 'lang',
  cookie: 'gmlang',
  autoReload: true,
  updateFiles: true
});

module.exports = function(app) {
	app.use(cookieParser());
	app.use(i18n.init);
	app.engine('handlebars', exphbs.create({
		defaultLayout: 'main',
		layoutsDir: app.get('views') + '/layouts',
		partialsDir: [app.get('views') + '/partials'],
		helpers: {
			times: function(n, block) {
  			var accum = '';
  			for(var i = 0; i <= n; ++i)
      			accum += block.fn(i);
  			return accum;
  		},
  		select: function(value, options) {
				return options.fn(this)
  				.split('\n')
  				.map(function(v) {
    					var t = 'value="' + value + '"';
    					return ! RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"');
  				})
  				.join('\n')
			},
			__: function() { return i18n.__.apply(this, arguments); },
  		__n: function() { return i18n.__n.apply(this, arguments); },
			inc: function(number, options) {
				if (typeof(number) === 'undefined' || number === null)
      		return null;
  			return number + (options.hash.inc || 1);
			}
  	}
	}).engine);
	app.set('view engine', 'handlebars');
	app.use(session({
	    secret: '2C44-4D44-WppQ38S',
	    resave: true,
	    saveUninitialized: true,
	    cookie: { maxAge: 36000000 }
	}));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(multer({ dest: path.join(__dirname, 'public/img') }).single('file'));
	app.use(methodOverride());
	routes(app);
	app.use(express.static(path.join(__dirname, '../public')));
	app.use('/bower_components',  express.static(path.join(__dirname, '../bower_components')));
	return app;
};
