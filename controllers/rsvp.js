var Rsvp = require('../models/rsvpmodel'),
	mongoose = require('mongoose'),
	nodemailer = require('nodemailer');

module.exports = {

	index: function (req, res) {
		var viewModel = {
			guests: []
		}
		Rsvp.find({}, {}, {}, function (err, guests) {
			res.render('rsvp', viewModel);
		});
	},

	guests: function (req, res) {
		var viewModel = {
			guests: []
		};
		Rsvp.find({}, {}, {}, function (err, guests) {
			if(err) { throw err; }
			viewModel.guests = guests;
			res.render('guests', viewModel);
		});
	},

	newGuests: function (req, res) {
		console.log(req.body)
		var newGuest = new Rsvp({
			couple: req.body.couple,
			firstName1: req.body.firstName1,
			lastName1: req.body.lastName1,
			firstName2: req.body.firstName2,
			lastName2: req.body.lastName2,
			email1: req.body.email1,
			email2: req.body.email2,
			attWed1: req.body.attWed1,
			attWed2: req.body.attWed2,
			attReh1: req.body.attReh1,
			attReh2: req.body.attReh2,
			children: req.body.children,
			childWed: req.body.childWed,
			childReh: req.body.childReh,
			food1: req.body.food1,
			food2: req.body.food2,
			message: req.body.message
		});
		newGuest.save(function (err, item) {
			res.redirect('/rsvp/guests');
		});
	},

	updateGuests: function(req, res) {
		Rsvp.findOne({ _id: req.body.id }, function(err, guest) {
			guest.couple = req.body.couple;
			guest.firstName1 = req.body.firstName1;
			guest.lastName1 = req.body.lastName1;
			guest.firstName2 = req.body.firstName2;
			guest.lastName2 = req.body.lastName2;
			guest.email1 = req.body.email1;
			guest.email2 = req.body.email2;
			guest.attWed1 = req.body.attWed1;
			guest.attWed2 = req.body.attWed2;
			guest.attReh1 = req.body.attReh1;
			guest.attReh2 = req.body.attReh2;
			guest.children = req.body.children;
			guest.childWed = req.body.childWed;
			guest.childReh = req.body.childReh;
			guest.food1 = req.body.food1;
			guest.food2 = req.body.food2;
			guest.message = req.body.message;
			guest.save(function (err) {
				res.redirect('/rsvp/guests');
			});
		});
	},

	updateGuestsByThem: function(req, res) {
		Rsvp.findOne({ _id: req.query.id }, function(err, guest) {
			if (req.query.firstName2) guest.firstName2 = req.query.firstName2;
			if (req.query.lastName2) guest.lastName2 = req.query.lastName2;
			guest.attWed1 = req.query.attWed1;
			guest.attWed2 = req.query.attWed2;
			guest.attReh1 = req.query.attReh1;
			guest.attReh2 = req.query.attReh2;
			if (req.query.childWed) guest.childWed = req.query.childWed;
			if (req.query.childReh) guest.childReh = req.query.childReh;
			guest.food1 = req.query.food1;
			if (req.query.food2) guest.food2 = req.query.food2;
			guest.message = req.query.message;
			guest.save(function (err) {
				res.send(true);
			});
		});
	},	

	deleteGuests: function (req, res) {
		Rsvp.findByIdAndRemove(req.body.id, function (err) {
			res.redirect('/rsvp/guests');
		});
	},

	searchGuests: function (req, res) {

		var name = req.query.name;
		name = name.split(/\s+/);

		var regexName = [];
		for (var i = 0; i < name.length; i++) {
			var temp = '(^|\s)' + name[i] + '(\s|$)';
			console.log('temp[' + i + ']: ' + temp);	
			var temp2 = new RegExp(temp, "i")
			console.log('regexName[' + i + ']: ' + temp2);	
			// var temp3 = '(^|\s)' + name[i] + '(\s|$)';
			regexName.push(temp2);
		}

		Rsvp.find( { $or: [ {firstName1: { $in : regexName }}, {lastName1 : { $in : regexName }}, {firstName2 : { $in : regexName }}, {lastName2 : { $in : regexName }} ]}, function (err, guests) {
			namesSend = [];
			for (var i = 0; i < guests.length; i++) {
				if (!guests[i].firstName1 && !guests[i].lastName1) {
					console.log('Sorry, but we can\'t find your name in our database. Please try again');
				} else {
					if (guests[i].firstName2 || guests[i].lastName2) {
						namesSend.push({ names: guests[i].firstName1 + ' ' + guests[i].lastName1 + ' & ' + guests[i].firstName2 + ' ' + guests[i].lastName2,
										 guests: guests[i] });
					} else {
						namesSend.push({ names: guests[i].firstName1 + ' ' + guests[i].lastName1, guests: guests[i] });
					}
				}
			}
			res.send(namesSend);
		});
	},

	summary: function (req, res) {
		var viewModel = {
			summary: {},
			guests: []
		};
		Rsvp.find({}, {}, {}, function (err, guests) {
			if(err) { throw err; }
			viewModel.guests = guests;
			var yes = 0;
			var no = 0;
			var notAnswered = 0;
			var reh = 0;
			var childWed = 0;
			var childReh = 0;
			var foodEve = 0;
			var foodFish = 0;
			var foodVeget = 0;
			var foodVegan = 0;
			for (var i = 0; i < viewModel.guests.length; i++) {
				if (viewModel.guests[i].attWed1 === 'Yes') yes += 1;
				if (viewModel.guests[i].attWed2 === 'Yes') yes += 1;
				if (viewModel.guests[i].attWed1 === 'No') no += 1;
				if (viewModel.guests[i].attWed2 === 'No') no += 1;
				if (viewModel.guests[i].attWed1 !== 'Yes' && viewModel.guests[i].attWed1 !== 'No') notAnswered += 1;
				if (viewModel.guests[i].attWed2 !== 'Yes' && viewModel.guests[i].attWed2 !== 'No' && viewModel.guests[i].lastName2 != null && viewModel.guests[i].lastName2 != '') notAnswered += 1;
				if (viewModel.guests[i].attReh1 === 'Yes') reh += 1;
				if (viewModel.guests[i].attReh2 === 'Yes') reh += 1;
				if (typeof viewModel.guests[i].childWed === 'number') childWed += viewModel.guests[i].childWed;
				if (typeof viewModel.guests[i].childReh === 'number') childReh += viewModel.guests[i].childReh;
				if (viewModel.guests[i].attWed1 === 'Yes' && viewModel.guests[i].food1 === 'Everything!') foodEve += 1;
				if (viewModel.guests[i].attWed1 === 'Yes' && viewModel.guests[i].food1 === 'Fish') foodFish += 1;
				if (viewModel.guests[i].attWed1 === 'Yes' && viewModel.guests[i].food1 === 'Vegetables') foodVeget += 1;
				if (viewModel.guests[i].attWed1 === 'Yes' && viewModel.guests[i].food1 === 'Vegan crap') foodVegan += 1;
				if (viewModel.guests[i].attWed2 === 'Yes' && viewModel.guests[i].food2 === 'Everything!') foodEve += 1;
				if (viewModel.guests[i].attWed2 === 'Yes' && viewModel.guests[i].food2 === 'Fish') foodFish += 1;
				if (viewModel.guests[i].attWed2 === 'Yes' && viewModel.guests[i].food2 === 'Vegetables') foodVeget += 1;
				if (viewModel.guests[i].attWed2 === 'Yes' && viewModel.guests[i].food2 === 'Vegan crap') foodVegan += 1;
			}
			viewModel.summary.yes = yes;
			viewModel.summary.no = no;
			viewModel.summary.notAnswered = notAnswered;
			viewModel.summary.numGuests = yes + no + notAnswered;
			viewModel.summary.reh = reh;
			viewModel.summary.childWed = childWed;
			viewModel.summary.childReh = childReh;
			viewModel.summary.foodEve = foodEve;
			viewModel.summary.foodFish = foodFish;
			viewModel.summary.foodVeget = foodVeget;
			viewModel.summary.foodVegan = foodVegan;
			res.render('summary', viewModel);
		});
	},

	sendEmail: function (req, res) {
		var transporter = nodemailer.createTransport({
	        service: 'Gmail',
	        auth: {
	            user: 'oriolmirosa@gmail.com', // Your email id
	            pass: 'Sarah666!!!' // Your password
	        }
		});

		var emailBody = "<p>We just received an RSVP from <strong>" + req.body.allNames + "</strong>:</p><br/>" + req.body.response;

		var mailOptions = {
		    from: 'oriolmirosa@gmail.com', // sender address
		    to: 'oriolmirosa@gmail.com, skaron@gmail.com', // list of receivers
		    subject: 'Wedding RSVP!', // Subject line
		    html: emailBody
		};

		transporter.sendMail(mailOptions, function(error, info) {
		    if (error) {
		        console.log(error);
		        res.json({yo: 'error'});
		    } else {
		        console.log('Message sent: ' + info.response);
		        res.json({yo: info.response});
		    };
		});
	}
};
