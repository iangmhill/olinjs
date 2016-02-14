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
      var inStockClass = '';
      var inStockClassNotation = '';
      var price = '$' + data.price.toFixed(2);
      var id = data.id;
      if (!data.inStock) {
        inStockClass = 'out-of-stock'
        inStockClassNotation = '(out of stock)';
      }
      $("#ingredients-list").append(
        $('<div class="ingredients ' + inStockClass + '"></div>')
        .append($('<span class="name">' + name + '</span>'))
        .append($('<span class="stock">' + inStockNotation + '</span>'))
        .append($('<span class="price right"></span>')
          .append($(' <button class="edit-ingredient" value="' +
              id + '">Edit</button>'))
          .append($('<button class="out-of-stock-ingredient" value="' + 
              id + '">Out of stock</button>')))
        .append($('<span class="right">' + price + '</span>')
        )
      );
      $createIngredientForm.trigger('reset');
    }
  });
});

$(document).ready(function() {
  $('.edit-ingredient').click(function(event) {
    event.preventDefault();
    var $ingredient = $(this)
    var name = $ingredient.parent().siblings('.name').text().trim();
    var price = $ingredient.parent().siblings('.price').text().replace(/[^0-9\.]+/g,"");
    console.log(price);
    $ingredient.parents('.ingredient').after(
      $('<form id="edit-ingredient-form" class="ingredient-form" action="api/updateIngredient" method="POST"></form>')
        .append($('<div class="label">Name:</div>'))
        .append($('<input type="text" name="name" value="' + name + '"/>'))
        .append($('<div class="label">Price:</div>'))
        .append($('<input type="number" step="any" name="price" value="' + price + '"/>'))
        .append($('<input class="submit-button" type="submit" value="Submit">'))
    );
    var id = $ingredient.val();
    console.log(id);
    var $editIngredientForm = $('#edit-ingredient-form');
    $editIngredientForm.submit(function(event) {
      event.preventDefault();
      var name = $(this).find("[name='name']").val();
      var price = $(this).find("[name='price']").val();
      console.log(id);
      $.ajax({
        type: 'POST',
        url: '/api/updateIngredient',
        data: JSON.stringify({
          id: id,
          name: name,
          price: price
        }),
        contentType: 'application/json',
        success: function(data, status) {
          $ingredient.parent().siblings('.name').text(data.name);
          $ingredient.parent().siblings('.price')
              .text('$' + data.price.toFixed(2));
          $editIngredientForm.remove();
        }
      });
    });
  });
  $('.out-of-stock-ingredient').click(function(event) {
    event.preventDefault();
    var $ingredient = $(this);
    
    $.ajax({
      type: 'POST',
      url: '/api/changeStockIngredient',
      contentType: 'application/json',
      data: JSON.stringify({
        id: $ingredient.val()
      })
    }).done(function(data, status) {
      if (data.success == true) {
        if (data.inStock) {
          $ingredient.parents('.ingredient').removeClass('out-of-stock');
          $ingredient.parent().siblings('.stock').text('');
        } else {
          $ingredient.parents('.ingredient').addClass('out-of-stock');
          $ingredient.parent().siblings('.stock').text('(out of stock)');
        }
      }
    });
  });
});