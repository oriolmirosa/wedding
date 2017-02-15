var express = require('express'),
	config = require('./server/configure'),
	app = express(),
	mongoose = require('mongoose');

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app = config(app);

// mongoose.connect('mongodb://localhost/wedding');
mongoose.connect('mongodb://oriolmirosa:rXb0RxA9YvxS@ds017636.mlab.com:17636/wedding');
mongoose.connection.on('open', function() {
	console.log('Mongoose connected.');
});

app.listen(app.get('port'), function() {
	console.log('Server up: http://localhost:' + app.get('port'));
});