var Rsvp = require('../models/rsvpmodel'),
	mongoose = require('mongoose'),
	nodemailer = require('nodemailer'),
	helper = require('sendgrid').mail,
	sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

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
			firstName3: req.body.firstName3,
			lastName3: req.body.lastName3,
			firstName4: req.body.firstName4,
			lastName4: req.body.lastName4,
			firstName5: req.body.firstName5,
			lastName5: req.body.lastName5,
			attWed1: req.body.attWed1,
			attWed2: req.body.attWed2,
			attWed3: req.body.attWed3,
			attWed4: req.body.attWed4,
			attWed5: req.body.attWed5,
			attReh1: req.body.attReh1,
			attReh2: req.body.attReh2,
			attReh3: req.body.attReh3,
			attReh4: req.body.attReh4,
			attReh5: req.body.attReh5,
			children: req.body.children,
			childWed: req.body.childWed,
			childReh: req.body.childReh,
			food1: req.body.food1,
			food2: req.body.food2,
			food3: req.body.food3,
			food4: req.body.food4,
			food5: req.body.food5,
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
			guest.firstName3 = req.body.firstName3;
			guest.lastName3 = req.body.lastName3;
			guest.firstName4 = req.body.firstName4;
			guest.lastName4 = req.body.lastName4;
			guest.firstName5 = req.body.firstName5;
			guest.lastName5 = req.body.lastName5;
			guest.attWed1 = req.body.attWed1;
			guest.attWed2 = req.body.attWed2;
			guest.attWed3 = req.body.attWed3;
			guest.attWed4 = req.body.attWed4;
			guest.attWed5 = req.body.attWed5;
			guest.attReh1 = req.body.attReh1;
			guest.attReh2 = req.body.attReh2;
			guest.attReh3 = req.body.attReh3;
			guest.attReh4 = req.body.attReh4;
			guest.attReh5 = req.body.attReh5;
			guest.children = req.body.children;
			guest.childWed = req.body.childWed;
			guest.childReh = req.body.childReh;
			guest.food1 = req.body.food1;
			guest.food2 = req.body.food2;
			guest.food3 = req.body.food3;
			guest.food4 = req.body.food4;
			guest.food5 = req.body.food5;
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
			if (req.query.firstName3) guest.firstName3 = req.query.firstName3;
			if (req.query.lastName3) guest.lastName3 = req.query.lastName3;
			if (req.query.firstName4) guest.firstName4 = req.query.firstName4;
			if (req.query.lastName4) guest.lastName4 = req.query.lastName4;
			if (req.query.firstName5) guest.firstName5 = req.query.firstName5;
			if (req.query.lastName5) guest.lastName5 = req.query.lastName5;
			guest.attWed1 = req.query.attWed1;
			guest.attWed2 = req.query.attWed2;
			guest.attWed3 = req.query.attWed3;
			guest.attWed4 = req.query.attWed4;
			guest.attWed5 = req.query.attWed5;
			guest.attReh1 = req.query.attReh1;
			guest.attReh2 = req.query.attReh2;
			guest.attReh3 = req.query.attReh3;
			guest.attReh4 = req.query.attReh4;
			guest.attReh5 = req.query.attReh5;
			if (req.query.childWed) guest.childWed = req.query.childWed;
			if (req.query.childReh) guest.childReh = req.query.childReh;
			guest.food1 = req.query.food1;
			if (req.query.food2) guest.food2 = req.query.food2;
			if (req.query.food3) guest.food3 = req.query.food3;
			if (req.query.food4) guest.food4 = req.query.food4;
			if (req.query.food5) guest.food5 = req.query.food5;
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
			var temp2 = new RegExp(temp, "i");
			console.log('regexName[' + i + ']: ' + temp2);
			regexName.push(temp2);
			if (name[i - 1]) {
				var temp3 = '(^|\s)' + name[i - 1] + ' ' + name[i] + '(\s|$)';
				var temp4 = new RegExp(temp3, "i");
				regexName.push(temp4);
			}
		}

		Rsvp.find( { $or:
			[ {firstName1 : { $in : regexName }}, {lastName1 : { $in : regexName }},
				{firstName2 : { $in : regexName }}, {lastName2 : { $in : regexName }},
			 	{firstName3 : { $in : regexName }}, {lastName3 : { $in : regexName }},
				{firstName4 : { $in : regexName }}, {lastName4 : { $in : regexName }},
				{firstName5 : { $in : regexName }}, {lastName5 : { $in : regexName }}
			]}, function (err, guests) {
				namesSend = [];
				for (var i = 0; i < guests.length; i++) {
					if (!guests[i].firstName1 && !guests[i].lastName1) {
						console.log('Sorry, but we can\'t find your name in our database. Please try again');
					} else if (guests[i].firstName5 || guests[i].lastName5) {
						 namesSend.push({ names: guests[i].firstName1 + ' ' + guests[i].lastName1 + ' , ' + guests[i].firstName2 + ' ' + guests[i].lastName2 + ' , ' + guests[i].firstName3 + ' ' + guests[i].lastName3 + ' , ' + guests[i].firstName4 + ' ' + guests[i].lastName4 + ' & ' + guests[i].firstName5 + ' ' + guests[i].lastName5, guests: guests[i] });
					} else if (guests[i].firstName4 || guests[i].lastName4) {
							namesSend.push({ names: guests[i].firstName1 + ' ' + guests[i].lastName1 + ' , ' + guests[i].firstName2 + ' ' + guests[i].lastName2 + ' , ' + guests[i].firstName3 + ' ' + guests[i].lastName3 + ' & ' + guests[i].firstName4 + ' ' + guests[i].lastName4, guests: guests[i] });
					} else if (guests[i].firstName3 || guests[i].lastName3) {
						namesSend.push({ names: guests[i].firstName1 + ' ' + guests[i].lastName1 + ' , ' + guests[i].firstName2 + ' ' + guests[i].lastName2 + ' & ' + guests[i].firstName3 + ' ' + guests[i].lastName3, guests: guests[i] });
					} else if (guests[i].firstName2 || guests[i].lastName2) {
						namesSend.push({ names: guests[i].firstName1 + ' ' + guests[i].lastName1 + ' & ' + guests[i].firstName2 + ' ' + guests[i].lastName2, guests: guests[i] });
					} else {
						namesSend.push({ names: guests[i].firstName1 + ' ' + guests[i].lastName1, guests: guests[i] });
					}
				}
				res.send(namesSend);
			}
		);
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
			var potentialChild = 0;
			var childWed = 0;
			var childReh = 0;
			var foodEve = 0;
			var foodFish = 0;
			var foodVeget = 0;
			for (var i = 0; i < viewModel.guests.length; i++) {
				if (viewModel.guests[i].attWed1 === 'Yes') yes += 1;
				if (viewModel.guests[i].attWed2 === 'Yes') yes += 1;
				if (viewModel.guests[i].attWed3 === 'Yes') yes += 1;
				if (viewModel.guests[i].attWed4 === 'Yes') yes += 1;
				if (viewModel.guests[i].attWed5 === 'Yes') yes += 1;
				if (viewModel.guests[i].attWed1 === 'No') no += 1;
				if (viewModel.guests[i].attWed2 === 'No') no += 1;
				if (viewModel.guests[i].attWed3 === 'No') no += 1;
				if (viewModel.guests[i].attWed4 === 'No') no += 1;
				if (viewModel.guests[i].attWed5 === 'No') no += 1;
				if (viewModel.guests[i].attWed1 !== 'Yes' && viewModel.guests[i].attWed1 !== 'No') notAnswered += 1;
				if (viewModel.guests[i].attWed2 !== 'Yes' && viewModel.guests[i].attWed2 !== 'No' && viewModel.guests[i].lastName2 != null && viewModel.guests[i].lastName2 != '') notAnswered += 1;
				if (viewModel.guests[i].attWed3 !== 'Yes' && viewModel.guests[i].attWed3 !== 'No' && viewModel.guests[i].lastName3 != null && viewModel.guests[i].lastName3 != '') notAnswered += 1;
				if (viewModel.guests[i].attWed4 !== 'Yes' && viewModel.guests[i].attWed4 !== 'No' && viewModel.guests[i].lastName4 != null && viewModel.guests[i].lastName4 != '') notAnswered += 1;
				if (viewModel.guests[i].attWed5 !== 'Yes' && viewModel.guests[i].attWed5 !== 'No' && viewModel.guests[i].lastName5 != null && viewModel.guests[i].lastName5 != '') notAnswered += 1;
				if (viewModel.guests[i].attReh1 === 'Yes') reh += 1;
				if (viewModel.guests[i].attReh2 === 'Yes') reh += 1;
				if (viewModel.guests[i].attReh3 === 'Yes') reh += 1;
				if (viewModel.guests[i].attReh4 === 'Yes') reh += 1;
				if (viewModel.guests[i].attReh5 === 'Yes') reh += 1;
				if (typeof viewModel.guests[i].childWed === 'number') childWed += viewModel.guests[i].childWed;
				if (typeof viewModel.guests[i].childReh === 'number') childReh += viewModel.guests[i].childReh;
				if (typeof viewModel.guests[i].children === 'number') potentialChild += viewModel.guests[i].children;
				if (viewModel.guests[i].attWed1 === 'Yes' && viewModel.guests[i].food1 === 'Everything!') foodEve += 1;
				if (viewModel.guests[i].attWed1 === 'Yes' && viewModel.guests[i].food1 === 'Fish') foodFish += 1;
				if (viewModel.guests[i].attWed1 === 'Yes' && viewModel.guests[i].food1 === 'Vegetables') foodVeget += 1;
				if (viewModel.guests[i].attWed2 === 'Yes' && viewModel.guests[i].food2 === 'Everything!') foodEve += 1;
				if (viewModel.guests[i].attWed2 === 'Yes' && viewModel.guests[i].food2 === 'Fish') foodFish += 1;
				if (viewModel.guests[i].attWed2 === 'Yes' && viewModel.guests[i].food2 === 'Vegetables') foodVeget += 1;
				if (viewModel.guests[i].attWed3 === 'Yes' && viewModel.guests[i].food3 === 'Everything!') foodEve += 1;
				if (viewModel.guests[i].attWed3 === 'Yes' && viewModel.guests[i].food3 === 'Fish') foodFish += 1;
				if (viewModel.guests[i].attWed3 === 'Yes' && viewModel.guests[i].food3 === 'Vegetables') foodVeget += 1;
				if (viewModel.guests[i].attWed4 === 'Yes' && viewModel.guests[i].food4 === 'Everything!') foodEve += 1;
				if (viewModel.guests[i].attWed4 === 'Yes' && viewModel.guests[i].food4 === 'Fish') foodFish += 1;
				if (viewModel.guests[i].attWed4 === 'Yes' && viewModel.guests[i].food4 === 'Vegetables') foodVeget += 1;
				if (viewModel.guests[i].attWed5 === 'Yes' && viewModel.guests[i].food5 === 'Everything!') foodEve += 1;
				if (viewModel.guests[i].attWed5 === 'Yes' && viewModel.guests[i].food5 === 'Fish') foodFish += 1;
				if (viewModel.guests[i].attWed5 === 'Yes' && viewModel.guests[i].food5 === 'Vegetables') foodVeget += 1;
				if (viewModel.guests[i].attWed1 === 'Select an option') viewModel.guests[i].attWed1 = '';
				if (viewModel.guests[i].attWed2 === 'Select an option') viewModel.guests[i].attWed2 = '';
				if (viewModel.guests[i].attWed3 === 'Select an option') viewModel.guests[i].attWed3 = '';
				if (viewModel.guests[i].attWed4 === 'Select an option') viewModel.guests[i].attWed4 = '';
				if (viewModel.guests[i].attWed5 === 'Select an option') viewModel.guests[i].attWed5 = '';
				if (viewModel.guests[i].attWed1 === 'Select an option')  viewModel.guests[i].attWed1 = '';
				if (viewModel.guests[i].attWed2 === 'Select an option')  viewModel.guests[i].attWed2 = '';
				if (viewModel.guests[i].attWed3 === 'Select an option')  viewModel.guests[i].attWed3 = '';
				if (viewModel.guests[i].attWed4 === 'Select an option')  viewModel.guests[i].attWed4 = '';
				if (viewModel.guests[i].attWed5 === 'Select an option')  viewModel.guests[i].attWed5 = '';
				if (viewModel.guests[i].attReh1 === 'Select an option') viewModel.guests[i].attReh1 = '';
				if (viewModel.guests[i].attReh2 === 'Select an option') viewModel.guests[i].attReh2 = '';
				if (viewModel.guests[i].attReh3 === 'Select an option') viewModel.guests[i].attReh3 = '';
				if (viewModel.guests[i].attReh4 === 'Select an option') viewModel.guests[i].attReh4 = '';
				if (viewModel.guests[i].attReh5 === 'Select an option') viewModel.guests[i].attReh5 = '';
				if (viewModel.guests[i].attWed1 === '' && viewModel.guests[i].attReh1 === '') viewModel.guests[i].food1 = '';
				if (viewModel.guests[i].attWed2 === '' && viewModel.guests[i].attReh2 === '') viewModel.guests[i].food2 = '';
				if (viewModel.guests[i].attWed3 === '' && viewModel.guests[i].attReh3 === '') viewModel.guests[i].food3 = '';
				if (viewModel.guests[i].attWed4 === '' && viewModel.guests[i].attReh4 === '') viewModel.guests[i].food4 = '';
				if (viewModel.guests[i].attWed5 === '' && viewModel.guests[i].attReh5 === '') viewModel.guests[i].food5 = '';
			}
			viewModel.summary.yes = yes;
			viewModel.summary.no = no;
			viewModel.summary.notAnswered = notAnswered;
			viewModel.summary.numGuests = yes + no + notAnswered;
			viewModel.summary.reh = reh;
			viewModel.summary.potentialChild = potentialChild;
			viewModel.summary.childWed = childWed;
			viewModel.summary.childReh = childReh;
			viewModel.summary.foodEve = foodEve;
			viewModel.summary.foodFish = foodFish;
			viewModel.summary.foodVeget = foodVeget;
			res.render('summary', viewModel);
		});
	},

	sendEmail: function (req, res) {
		console.log('req: ' + JSON.stringify(req.body, null, 4));
		var from_email = new helper.Email('oriolmirosa@gmail.com');
		var to_email = new helper.Email('oriolmirosa@gmail.com, skaron@gmail.com');
		var subject = 'Wedding RSVP!';
		var emailBody = "<p>We just received an RSVP from <strong>" + req.body.allNames + "</strong>:</p><br/>" + req.body.response;
		var content = new helper.Content('text/plain', emailBody);
		var mail = new helper.Mail(from_email, subject, to_email, content);

		var request = sg.emptyRequest({
		  method: 'POST',
		  path: '/v3/mail/send',
		  body: mail.toJSON()
		});

		sg.API(request, function(error, response) {
		  console.log('SendGrid status code: ' + response.statusCode);
		  console.log('SendGrid response body: ' + JSON.stringify(response.body, null, 4));
		  console.log('SendGrid response headers: ' + JSON.stringify(response.headers, null, 4));
		});

		// var transporter = nodemailer.createTransport({
	  //   host: 'smtp.gmail.com',
	  //   port: 465,
	  //   secure: true, // use SSL
	  //   auth: {
	  //       user: 'oriolmirosa@gmail.com',
	  //       pass: 'Sarah666!!!'
	  //   }

      // service: 'Gmail',
      // auth: {
      //     user: 'oriolmirosa@gmail.com', // Your email id
      //     pass: 'Sarah666!!!' // Your password
      // }
	// 	});
	//
	// 	var emailBody = "<p>We just received an RSVP from <strong>" + req.body.allNames + "</strong>:</p><br/>" + req.body.response;
	//
	// 	var mailOptions = {
	// 	    from: 'oriol@mirosa.org', // sender address
	// 	    to: 'oriolmirosa@gmail.com, skaron@gmail.com', // list of receivers
	// 	    subject: 'Wedding RSVP!', // Subject line
	// 	    html: emailBody
	// 	};
	//
	// 	transporter.sendMail(mailOptions, function(error, info) {
	// 	    if (error) {
	// 	        console.log(error);
	// 	        res.json({yo: 'error'});
	// 	    } else {
	// 	        console.log('Message sent: ' + info.response);
	// 	        res.json({yo: info.response});
	// 	    };
	// 	});
	}
};
