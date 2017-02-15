var Item = require('../models/registrymodel').Item,
	ItemTransaction = require('../models/registrymodel').ItemTransaction,
	Transaction = require('../models/registrymodel').Transaction,
	mongoose = require('mongoose');

module.exports = {

	index: function(req, res) {
		langCookie = req.cookies.gmlang;

		var viewModel = {
			items: []
		};
		Item.find({}, {}, {}, function(err, items) {
			if(err) { throw err; }
			var localizedResources = Item.schema.methods.toObjectLocalized(items, langCookie);
			viewModel.items = localizedResources;
			res.render('registry', viewModel);
		});
	},

	create: function(req, res) {
		var viewModel = {
			items: []
		};
		Item.find({}, {}, {}, function(err, items) {
			if(err) { throw err; }
			viewModel.items = items;
      console.log(`viewModel: ${JSON.stringify(viewModel.items)}`);
		res.render('create', viewModel);
		});
	},

	createItem: function(req, res) {
		var newItem = new Item({
			item: {en: req.body.itemEn, ca: req.body.itemCa},
			description: {en: req.body.descriptionEn, ca: req.body.descriptionCa},
			price: req.body.price,
			remaining: req.body.remaining,
			filename: req.file.originalname
		});
		console.log('newItem: ' + newItem);
		newItem.save(function(err, item) {
			res.redirect('/registry/create');
		});
	},

	updateItem: function(req, res) {
		// Item.update({ _id: req.body.id }, { $set: { item: req.body.item, description: req.body.description, price: parseInt(req.body.price), remaining: parseInt(req.body.remaining) }});
    if (req.file) {
  		Item.findOne({ _id: req.body.id }, function(err, item) {
  			item.item.en = req.body.itemEn;
  			item.item.ca = req.body.itemCa;
  			item.description.en = req.body.descriptionEn;
  			item.description.ca = req.body.descriptionCa;
  			item.price = parseInt(req.body.price);
  			item.remaining = parseInt(req.body.remaining);
        item.filename = req.file.originalname;
  			item.save(function(err) {
  				res.redirect('/registry/create');
  			});
  		});
    } else {
      Item.findOne({ _id: req.body.id }, function(err, item) {
  			item.item.en = req.body.itemEn;
  			item.item.ca = req.body.itemCa;
  			item.description.en = req.body.descriptionEn;
  			item.description.ca = req.body.descriptionCa;
  			item.price = parseInt(req.body.price);
  			item.remaining = parseInt(req.body.remaining);
  			item.save(function(err) {
  				res.redirect('/registry/create');
  			});
  		});
    }
	},

	deleteItem: function(req, res) {
		Item.findByIdAndRemove(req.body.id, function (err) {
			res.redirect('/registry/create');
		});
	},

  newTransaction: function(req, res) {
    langCookie = req.cookies.gmlang;
    var transaction = new Transaction();
    console.log('new transaction with id: ' + transaction._id);
    Item.find({}, '_id remaining item price filename', function(err, items) {
      if (!err){
        var localizedResources = Item.schema.methods.toObjectLocalizedOnly(items, langCookie, 'en');
        console.log(`localizedResources: ${JSON.stringify(localizedResources, null, 4)}`);
        res.send({transactionID: transaction._id, items: localizedResources});
      } else {
        throw err;
      }
    });
  },

  transactionSummary: function(req, res) {
    // console.log(`req.params: ${JSON.stringify(req.params, null, 4)}`);
    var transactionID = req.body.transactionID;
    var items = req.body.items;
    console.log(`transactionID: ${transactionID}`);
    console.log(`items: ${JSON.stringify(items, null, 4)}`);
    Transaction.findOne({_id: transactionID}, function(err, transaction) {
      console.log(`transaction: ${transaction}`);
      res.render('giftsummary', items);
    });
    // res.send({redirect: '/giftsummary'});
  },

	// giveSession: function(req, res) {
  //
	// 	var numberSelected = req.body.numberSelected;
	// 	var itemId = req.body.id;
	// 	var remaining = req.body.remaining;
	// 	console.log('req.body.numberSelected: ' + req.body.numberSelected);
	// 	console.log('req.body.id: ' + req.body.id);
	// 	console.log('req.body.remaining: ' + req.body.remaining);
	// 	ItemTransactionSession.findOne( { itemId: itemId }, function(err, itemtrans) {
  //     if (!itemtrans) {
  //       console.log('The item is not in this transactionSession.');
	// 			var itemtrans = new ItemTransactionSession({
	// 				itemId: itemId,
	// 				totalSelected: 1 * numberSelected,
	// 				remaining: remaining - 1 * numberSelected
	// 			});
	// 			itemtrans.save();
	// 			console.log('transactionSession item created and saved.');
	// 			console.log('Let\'s check the values of the document just created:');
	// 			console.log('itemId: ' + itemtrans.itemId);
	// 			console.log('totalSelected: ' + itemtrans.totalSelected);
	// 			console.log('remaining: ' + itemtrans.remaining + '\n\n');
	// 		} else {
	// 			console.log('item already exists in transactionSession, so we will load it and use it below');
	// 			itemtrans.totalSelected = numberSelected;
	// 			itemtrans.remaining = remaining;
	// 			itemtrans.save();
	// 			console.log('transactionSession updated and saved.');
	// 			console.log('Let\'s check the values of the document just updated:');
	// 			console.log('trans.itemId :' + itemtrans.itemId);
	// 			console.log('trans.totalSelected: ' + itemtrans.totalSelected);
	// 			console.log('trans.remaining: ' + itemtrans.remaining + '\n\n');
	// 		}
	// 	});
  // },


	// chooseRemain: function(req, res) {
	// 	console.log('chooseItem function called');
	// 	var chosenRemain = req.body;
	// 	console.log(chosenRemain);
	// 	var left = parseInt(chosenRemain.left);
	// 	console.log(left);
	// 	Item.findOne({ _id: chosenRemain.id }, function(err, item) {
	// 		if (err) throw err;

 // 			item.remaining = left;
 // 			item.save();
 // 		});
	// }
};
