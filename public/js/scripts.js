$(function() {

	$('.hiddenblur').hide();

	var totals = [];
	$('.dropdown').each(function(index) {
		var prova = $(this).children().first().next().children().length;
		if ($(this).children().first().next().children().length == 1) {
			$(this).children().first().html('Fulfilled');
			$(this).children().first().prop("disabled", true);
		}
	});

	var initialValue;
	var isVisible = false;
	
	$(".dropdown").on("shown.bs.dropdown", function(event){
	    initialValue = $(this).children().first().find('span:first').text();
	});

	$('.itemsremaining li > a').click(function (e) {
		e.preventDefault();
		var numberSelected = $(this).text();

		var id = $(this).parent().parent().prev().data('remain');

		var price = $(this).parent().parent().parent().prev().prev().children().first().text();
		price = price.slice(1);

		var totalPrice = (1*price) * (1*numberSelected);

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

		console.log(totalCart);

		var remaining = $('[data-remain=' + id + ']').parent().prev().children().first().children().first().find("strong").html();

		var left;

		if (isNaN(initialValue)) {
			left = 1*remaining - 1*numberSelected;
		} else {
			left = 1*remaining + 1*initialValue - 1*numberSelected;
		}

		$('[data-remain=' + id + ']').parent().prev().children().first().children().first().find("strong").html(left.toString());

		$('[data-remain=' + id + ']').find('span:first').html('&nbsp;' + numberSelected + '&nbsp;');

		$('.totalcart').find('span').text('$' + totalCart);
		
		var selected = {
			id: id,
			numberSelected: numberSelected,
			remaining: remaining
		};

		// $.post('/givesession', selected);
	});

});