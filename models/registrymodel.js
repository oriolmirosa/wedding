var mongoose = require('mongoose'),
	mongooseI18n = require('mongoose-i18n-localize'),
	Schema = mongoose.Schema;


var ItemSchema = new Schema({
	item: { type: String, required: true, i18n: true },
	description: { type: String, i18n: true },
	price: { type: Number, default: 0, required: true, min: 0 },
	remaining: { type: Number, default: 0, required: true, min: 0 },
	filename: { type: String }
});

ItemSchema.plugin(mongooseI18n, {
    locales: ['en', 'ca']
});

// ItemSchema.statics.updateRemaining = function(itemsGiven, callback) {
// 	this.findOne({ id: itemID }, {}, {}, function(err, item) {
// 		this.remaining -= itemsGiven;
// 		callback();
// 	} )
// };

var ItemTransactionSessionSchema = new Schema({
	itemId: { type: String, required: true },
	totalSelected: { type: Number, required: true, min: 0 },
	remaining: { type: Number, required: true, min: 0 },
});


var ItemTransactionSchema = new Schema({
	item: { type: ItemSchema },
	quantity: { type: Number, required: true, min: 0 }
});

ItemTransactionSchema.virtual('totalTransaction')
	.get(function () {
		return this.item.price * this.quantity;
	});



var GiveSchema = new Schema({
	name: { type: String, required: true},
	email: { type: String, required: true, min: 13 },
	address: { type: String, required: true, min: 13 },
	itemsGiven: [ItemTransactionSchema],
	date: { type: Date, default: Date.now() }
});

GiveSchema.virtual('totalGiven')
	.get(function () {
		var totalGiven;
		for (var i = 0; i < itemsGiven.length; i++) {
			totalGiven += itemsGiven[i].totalTransaction;
		}
	});


module.exports = {
	Item: mongoose.model('Item', ItemSchema),
	ItemTransaction: mongoose.model('ItemTransaction', ItemTransactionSchema),
	ItemTransactionSession: mongoose.model('ItemTransactionSession', ItemTransactionSessionSchema),
	Give: mongoose.model('Give', GiveSchema)
};