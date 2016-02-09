var $createIngredientForm = $("#create-ingredient-form");
var $ingredientsList = $("#ingredients-list");

$createIngredientForm.submit(function(event) {
  event.preventDefault();
  var name = $createIngredientForm.find("[name='name']").val();
  var price = $createIngredientForm.find("[name='price']").val();
  var inStock = true;
  $.ajax({
    type: 'POST',
    url: '/api/createIngredient',
    data: JSON.stringify({
      name: name,
      price: price,
      inStock: inStock
    }),
    contentType: 'application/json',
    success: function(data, status) {
      var name = data.name;
      var inStock = '';
      var price = '$' + data.price.toFixed(2);
      if (!data.inStock) {
        inStock = 'out-of-stock'
        name += ' (out of stock)';
      }
      $("#ingredients-list").append(
        $('<div class="ingredients ' + inStock + '"></div>').append(
          $('<span>' + name + '</span>')
        ).append(
          $('<span class="price">' + price + '</span>')
        )
      );
      $createIngredientForm.trigger('reset');
    }
  });
});