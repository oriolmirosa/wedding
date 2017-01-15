$(function() {

	$('.hiddenblur').hide();

	var totals = [];
	$('.dropdown').each(function(index) {
		var fulfilled = $(this).children().first().next().children().length;
		if ($(this).children().first().next().children().length == 1) {
			$(this).children().first().html('Fulfilled');
			$(this).children().first().prop("disabled", true);
		}
	});

  var transactionID;
  var items; // We fill these, when the modal is opened, and modify them with each selection on the dropdowns for each item

  $('#registryModalBtn').click(function (e) {
    var request = new XMLHttpRequest();
    request.open('GET', '/newtransaction', true);
    request.onreadystatechange = function() {
    	if(request.readyState == XMLHttpRequest.DONE && request.status == 200) {
        var response = JSON.parse(request.responseText);
      	transactionID = response.transactionID;
        items = response.items;
        items.forEach(function(item, index) {
          Object.assign(items[index], {"total": 0, "selected": 0});
        });
        console.log(`items when modal launched: ${JSON.stringify(items, null, 4)}`);
    	}
		}
    request.send();
  });

	var initialValue;
	var isVisible = false;

	$(".dropdown").on("shown.bs.dropdown", function (event) {
	    initialValue = $(this).children().first().find('span').first().text(); // Value selected on the item clicked
	});

	$('.itemsremaining li > a').click(function (e) { // When a selection is made for an item
		e.preventDefault();
		var numberSelected = $(this).text(); // The number of items selected

		var id = $(this)[0].parentNode.parentNode.parentNode.childNodes[1].getAttribute('data-remain'); // ID of the selected item

		var price = $(this).parent().parent().parent().prev().prev().children().first().children().first().text();
		price = price.slice(1); // price of the selected item

		var totalPrice = (1*price) * (1*numberSelected);

    // Gray out and remove gray when getting to/out of 0 items selected
		if (1*numberSelected === 0) {
			$(this).parent().parent().parent().parent().parent().prev().prev().find('.hiddenblur').fadeOut();
		} else {
			$(this).parent().parent().parent().parent().parent().prev().prev().children().first().children().first().next().next().find('span').text(totalPrice);
			$(this).parent().parent().parent().parent().parent().prev().prev().find('.hiddenblur').fadeIn();
		}

		var exists = false;
		for (var i = 0; i < totals.length; i++) {
			if (totals[i].id === id) {
				totals[i].amount = totalPrice;
				exists = true;
			}
		}

		if (!exists) {
			totals.push({id: id, amount: totalPrice});
		}

		var totalCart = 0;
		for (var i = 0; i < totals.length; i++) {
			totalCart += totals[i].amount;
		}

		var $remain = $('strong[data-remain="' + id + '"]');
		var $selected = $('span[data-remain="' + id + '"]');

		var remaining = $remain.text();

		var left;

		if (isNaN(initialValue)) {
			left = 1*remaining - 1*numberSelected;
		} else {
			left = 1*remaining + 1*initialValue - 1*numberSelected;
		}

		$remain.text(left.toString());

		$selected.html('&nbsp;' + numberSelected + '&nbsp;');

		$('.totalcart').find('span').text('$' + totalCart);

    // We need to modify the 'items' object that we loaded from the database

    for(var i = 0; i < items.length; i++) {
      if(items[i]._id === id) {
        Object.assign(items[i], {"_id": id, "remaining": left, "total": totalPrice});
      } else if(!items[i].total) {
        Object.assign(items[i], {"total": 0});
      }
    }

    for(var i = 0; i < items.length; i++) {
      if(items[i]._id === id) {
        if(!items[i].selected) {
          if(numberSelected) {
            Object.assign(items[i], {"selected": Number(numberSelected)});
          } else {
            Object.assign(items[i], {"selected": 0});
          }
        }
      }
    }

    console.log(`items: ${JSON.stringify(items, null, 4)}`);
	});

  $('#btn-registry-exit').click(function (e) {
    window.location.reload(false);
  });

  // function post(path, params, method) {
  //   method = method || "post"; // Set method to post by default if not specified.
  //
  //   // The rest of this code assumes you are not using a library.
  //   // It can be made less wordy if you use one.
  //   var form = document.createElement("form");
  //   form.setAttribute("method", method);
  //   form.setAttribute("action", path);
  //
  //   for(var key in params) {
  //       if(params.hasOwnProperty(key)) {
  //           var hiddenField = document.createElement("input");
  //           hiddenField.setAttribute("type", "hidden");
  //           hiddenField.setAttribute("name", key);
  //           hiddenField.setAttribute("value", params[key]);
  //
  //           form.appendChild(hiddenField);
  //        }
  //   }
  //
  //   document.body.appendChild(form);
  //   form.submit();
  // }

  function post(path, parameters) {
        var form = $('<form></form>');

        form.attr("method", "post");
        form.attr("action", path);

        $.each(parameters, function(key, value) {
            if ( typeof value == 'object' || typeof value == 'array' ) {
                $.each(value, function(subkey, subvalue) {
                    var field = $('<input />');
                    field.attr("type", "hidden");
                    field.attr("name", key+'[]');
                    field.attr("value", subvalue);
                    form.append(field);
                });
            } else {
                var field = $('<input />');
                field.attr("type", "hidden");
                field.attr("name", key);
                field.attr("value", value);
                form.append(field);
            }
        });
        $(document.body).append(form);
        form.submit();
    }

  $('#btn-registry-checkout').click(function(e) {
    e.preventDefault();

    // var form = document.createElement("form");
    // form.setAttribute("method", "post");
    // form.setAttribute("action", "/giftsummary");
    //
    // var formData = new FormData(form);
    // formData.append('transactionID', transactionID);
    // formData.append('items', items);
    // document.body.appendChild(form);
    // form.submit(formData);

    var allSelected = items.reduce(function(previous, current) {
      return current.selected + previous;
    }, 0);

    var items2 = JSON.stringify(items);

    if (allSelected === 0) {
      $('#btn-registry-checkout').blur();
      if ($('#btn-registry-checkout').text() === 'Ready to checkout') {
        swal("You need to select at least one item in order to proceed to the checkout page.");
      } else {
        swal("Heu de seleccionar almenys un element per procedir a la página seguent.");
      }
    } else {
      post('/giftsummary', { transactionID: transactionID, items: items2 });
    }

    // $.post('/giftsummary', { transactionID: transactionID, items: items })
      // .done(function( data ) {
      //   if (typeof data.redirect == 'string') {
      //     window.location = data.redirect;
      //   }
      // });
  });
    // var request = new XMLHttpRequest();
    // request.open('POST', '/transactionsummary', true);
    // request.send({transactionID: transactionID, items: items});
});
