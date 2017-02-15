var Item = require('../models/registrymodel').Item,
	ItemTransaction = require('../models/registrymodel').ItemTransaction,
	Transaction = require('../models/registrymodel').Transaction,
	mongoose = require('mongoose'),
  sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

module.exports = {

	index: function(req, res) {
		langCookie = req.cookies.gmlang;

    var items = req.body.items;
    items = JSON.parse(items);

    var total = 0;
    for (var i = items.length - 1; i >= 0; i--) {
      if(items[i].selected === 0) {
        items.splice(i, 1);
      } else {
        total += items[i].selected * items[i].price;
      }
    }

		res.render('giftsummary', {items: items, total: total});
	},

  processTransaction: function(req, res) {

    var transItems = req.body.transItems;
    var newmessage = req.body.message;

    if (req.body.message = "" || !req.body.message) {
      message = "";
    } else {
      message = "Message:<br/><p>\"" + newmessage + "\"</p>";
    }

    var subject = 'New wedding gift!';
		var emailBody = "<p>We just received a wedding gift from <strong>" + req.body.name + "</strong> (" + req.body.email + ")</p><br/>" + message + "<p>Items purchased:</p><br/><table>" + req.body.itemsPurchased + "</table><br/><h3><strong>TOTAL: $" + req.body.total + "<strong></h3>";

		var request = sg.emptyRequest({
		  method: 'POST',
		  path: '/v3/mail/send',
		  body: {
		    personalizations: [
		      {
		        to: [
		          {
		            email: 'oriolmirosa@gmail.com',
		          },
							{
		            email: 'skaron@gmail.com',
		          }
		        ],
		        subject: subject,
		      },
		    ],
		    from: {
		      email: 'oriol@mirosa.org',
		    },
		    content: [
		      {
		        type: 'text/html',
		        value: emailBody,
		      },
		    ],
		  },
		});

		sg.API(request)
		  .then(response => {
		    console.log(response.statusCode);
		    console.log(response.body);
		    console.log(response.headers);
		  })
		  .catch(error => {
		    console.log(error.response.statusCode);
		  });

    res.send({redirect: '/thankyounote'})

    transItems.forEach(function(transItem) {
      Item.findOne({'_id': transItem.id}, function(err, item) {
        item.remaining = transItem.remaining;
        item.save(function(err) {
          if (err) throw err;
        });
      })
    });
  }
}
