var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var RsvpSchema = new Schema({
	couple: { type: String },
	firstName1: { type: String },
	lastName1: { type: String },
	firstName2: { type: String },
	lastName2: { type: String },
	firstName3: { type: String },
	lastName3: { type: String },
	firstName4: { type: String },
	lastName4: { type: String },
	firstName5: { type: String },
	lastName5: { type: String },
	attWed1: { type: String },
	attWed2: { type: String },
	attWed3: { type: String },
	attWed4: { type: String },
	attWed5: { type: String },
	attReh1: { type: String },
	attReh2: { type: String },
	attReh3: { type: String },
	attReh4: { type: String },
	attReh5: { type: String },
	children: { type: Number, default: 0, min: 0 },
	childWed: { type: Number, default: 0, min: 0 },
	childReh: { type: Number, default: 0, min: 0 },
	food1: { type: String, default: 'Everything!' },
	food2: { type: String, default: 'Everything!' },
	food3: { type: String, default: 'Everything!' },
	food4: { type: String, default: 'Everything!' },
	food5: { type: String, default: 'Everything!' },
	message: { type: String }
});

module.exports = mongoose.model('Rsvp', RsvpSchema);
