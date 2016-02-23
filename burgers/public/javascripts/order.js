var totalPrice = 0;
var ingredientsList = [];
var $createOrderForm = $("#create-order-form");

$(document).ready(function() {
  $.ajax({
    type: 'GET',
    url: '/api/getIngredients',
    contentType: 'application/json'
  }).done(function(data, status) {
    ingredientsList = data;
    function findPrice(id) {
      for (var i = 0; i < ingredientsList.length; i++) {
        if (id === ingredientsList[i]._id) {
          return ingredientsList[i].price;
        }
      }
      return 0;
    }

    var $checkboxes = $( "#ingredients input:checkbox" );
    $checkboxes.change(function() {
      if (this.checked) {
        totalPrice += findPrice(this.value);
      } else {
        totalPrice -= findPrice(this.value);
      }
      $('#total-price').text('$' + totalPrice.toFixed(2));
    })
  });
});

$createOrderForm.submit(function(event) {
  event.preventDefault();
  var name = '';
  var ingredients = [];
  var inputs = $createOrderForm.serializeArray();
  $.each(inputs, function (i, input) {
    if (input.name === 'name') {
      name = input.value;
    } else if (input.name === 'ingredient') {
      ingredients.push(input.value);
    }
  });
  $.ajax({
    type: 'POST',
    url: '/api/createOrder',
    contentType: 'application/json',
    data: JSON.stringify({
      name: name,
      ingredients: ingredients
    })
  }).done(function(data, status) {
    $createOrderForm.after(
        $('<span>Thank you for your order! The total cost is $' + 
        data.price.toFixed(2) + '</span>'));
  });
  $createOrderForm.trigger('reset');
});
