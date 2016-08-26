var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var RsvpSchema = new Schema({
	couple: { type: String },
	firstName1: { type: String },
	lastName1: { type: String },
	firstName2: { type: String },
	lastName2: { type: String },
	email1: { type: String },
	email2: { type: String },
	attWed1: { type: String },
	attWed2: { type: String },
	attReh1: { type: String },
	attReh2: { type: String },
	children: { type: Number, default: 0, min: 0  },
	childWed: { type: Number, default: 0, min: 0 },
	childReh: { type: Number, default: 0, min: 0 },
	message: { type: String }
});

module.exports = mongoose.model('Rsvp', RsvpSchema);