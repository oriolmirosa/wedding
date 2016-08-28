$(function() {

	$('.hiddenblur').hide();

	var totals = [];
	$('.dropdown').each(function(index) {
		var fulfilled = $(this).children().first().next().children().length;
		console.log('fulfilled[' + index + ']: ' + fulfilled);
		if ($(this).children().first().next().children().length == 1) {
			$(this).children().first().html('Fulfilled');
			$(this).children().first().prop("disabled", true);
		}
	});

	var initialValue;
	var isVisible = false;
	
	$(".dropdown").on("shown.bs.dropdown", function (event) {
	    initialValue = $(this).children().first().find('span').first().text();
	    console.log('initialValue: ' + initialValue);
	});

	$('.itemsremaining li > a').click(function (e) {
		e.preventDefault();
		var numberSelected = $(this).text();
		console.log('numberSelected: ' + numberSelected);

		// var id2 = $(this).parent().parent().prev().data('remain');
		var id = $(this).parent().parent().prev().attr('data-remain');
		// var id3 = $(this).parent().parent().prev().prop('data-remain');
		
		console.log('id: ' + id);
		// console.log('id2: ' + id2);
		// console.log('id3: ' + id3);

		var price = $(this).parent().parent().parent().prev().prev().children().first().children().first().text();
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

		console.log('totalCart: ' + totalCart);

		// var prova = document.querySelectorAll('[data-remain="' + id + '"]');

		// console.log('prova.length: ' + prova.length);
		// console.log('typeof prova: ' + typeof prova);

		// Array.prototype.forEach.call(prova, function (el) {
		// 	console.log('prova: ' + el.innerHTML);
		// });

		var $remain = $('strong[data-remain="' + id + '"]');
		var $selected = $('span[data-remain="' + id + '"]');

		console.log('$remain.text(): ' + $remain.text());
		console.log('$remain.html(): ' + $remain.html());
		console.log('$selected.text(): ' + $selected.text());
		console.log('$selected.html(): ' + $selected.html());

		// var rightButton = document.querySelector('[data-remain="' + id + '"]');

		// console.log('typeof $rightButton: ' + typeof $rightButton);
		// console.log('$rightButton: ' + $rightButton);
		// console.log('$rightButton.text(): ' + $rightButton.text());

		// console.log('typeof rightButton: ' + typeof rightButton);
		// console.log('rightButton: ' + rightButton);
		// console.log('rightButton.innerHTML: ' + rightButton.innerHTML);

		// var remaining = $('[data-remain="' + id + '"]').parent().prev().children().first().children().first().find("strong").html();
		
		// var prova = rightButton.parentNode.parentNode.tagName

		// console.log(prova[0].innerHTML);
		// console.log(prova[1].innerHTML);
		// console.log(prova[2].innerHTML);

		var remaining = $remain.text();

		var left;

		if (isNaN(initialValue)) {
			left = 1*remaining - 1*numberSelected;
		} else {
			left = 1*remaining + 1*initialValue - 1*numberSelected;
		}

		console.log('left: ' + left);
		// The firstChild and the lastChild; parentNode, previousSibling and nextSibling

		// rightButton.parentNode.previousSibling.firstChild.firstChild.querySelector('strong').innerHTML = left.toString();
		// rightButton.querySelector('span').innerHTML = '&nbsp;' + numberSelected + '&nbsp;'

		$remain.text(left.toString());
		// $('[data-remain="' + id + '"]').parent().prev().children().first().children().first().find("strong").html(left.toString());

		$selected.html('&nbsp;' + numberSelected + '&nbsp;');
		// $('[data-remain="' + id + '"]').find('span').first().html('&nbsp;' + numberSelected + '&nbsp;');

		$('.totalcart').find('span').text('$' + totalCart);
		
		var selected = {
			id: id,
			numberSelected: numberSelected,
			remaining: remaining
		};

		// $.post('/givesession', selected);
	});

});