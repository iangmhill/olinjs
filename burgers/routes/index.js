var express = require('express');
var mongoose = require('mongoose');
var Ingredient = require('../models/ingredientModel.js');
var Order = require('../models/orderModel.js');

var routes = {
  ingredients: function(req, res) {
    Ingredient.find(function(err, ingredients){
      var displayIngredients = [];
      for (var i = 0; i < ingredients.length; i++) {
        var name = ingredients[i].name;
        var inStockClass = '';
        var inStockNotation = '';
        var price;
        var id = ingredients[i]._id;
        if (!ingredients[i].inStock) {
          inStockClass = 'out-of-stock';
          inStockNotation = '(out of stock)';
        }
        price = '$' + ingredients[i].price.toFixed(2);
        displayIngredients.push({
          name: name, 
          price: price, 
          inStockClass: inStockClass,
          inStockNotation: inStockNotation,
          id: id
        });
      }
      res.render('ingredients', {
        'ingredients': displayIngredients
      });
    });
  },
  order: function(req, res) {
    Ingredient.find(function(err, ingredients){
      var displayIngredients = [];
      for (var i = 0; i < ingredients.length; i++) {
        var name = ingredients[i].name;
        var price;
        var id = ingredients[i]._id;
        var inStockCheckbox = '';
        var inStockClass = '';
        var inStockNotation = '';
        if (!ingredients[i].inStock) {
          inStockCheckbox = 'disabled';
          inStockClass = 'out-of-stock';
          inStockNotation = '(out of stock)';
        }
        price = '$' + ingredients[i].price.toFixed(2);
        displayIngredients.push({
          name: name,
          price: price,
          inStockClass: inStockClass,
          inStockNotation: inStockNotation,
          inStockCheckbox: inStockCheckbox,
          id: id
        });
      }
      res.render('order', {
        'ingredients': displayIngredients
      });
    });
  },
  kitchen: function(req, res) {
    Order.find(function(err, orders){
      Ingredient.find(function(err, ingredients) {
        var ingredientDictionary = {};
        for (var i = 0; i < ingredients.length; i++) {
          ingredientDictionary[ingredients[i]._id] = ingredients[i].name;
        }
        var displayOrders = [];
        for (var i = 0; i < orders.length; i++) {
          console.log(orders[i]);
          var orderName = orders[i].name;
          var orderIngredients = '';
          var orderId = orders[i]._id;
          for (var j = 0; j < orders[i].ingredients.length; j++) {
            orderIngredients += 
                (ingredientDictionary[orders[i].ingredients[j]] + ', ');
          }
          displayOrders.push({
            name: orderName,
            ingredients: orderIngredients,
            id: orderId
          });
        }
        res.render('kitchen', {
          'orders': displayOrders
        });
      });

    });
  },
  createIngredient: function(req, res) {
    if (req.xhr) {
      var newIngredient = new Ingredient(req.body);
      newIngredient.save(function (err) {
        if (err) {
          console.log("Problem saving newIngredient", err);
        }
      });
      res.send({
        name: newIngredient.name,
        price: newIngredient.price,
        inStock: newIngredient.inStock
      });
    }
  },
  getIngredients: function(req, res) {
    Ingredient.find(function(err, ingredients) {
      res.send(ingredients);
    });
  },
  updateIngredient: function(req, res) {
    var id = req.body.id;
    console.log(id);
    Ingredient.findById(id, function (err, ingredient) {
      ingredient.name = req.body.name;
      ingredient.price = req.body.price;
      ingredient.save(function (err) {
        if (err) return;
        res.send({
          success: true,
          name: ingredient.name,
          price: ingredient.price
        });
      });
    });
  },
  changeStockIngredient: function(req, res) {
    var id = req.body.id;
    Ingredient.findById(id, function (err, ingredient) {
      ingredient.inStock = !ingredient.inStock;
      ingredient.save(function (err) {
        if (err) return;
        res.send({
          success: true,
          inStock: ingredient.inStock
        });
      });
    });
  },
  createOrder: function(req, res) {
    if (req.xhr) {
      console.log(req.body);
      var name = req.body.name;
      var ingredients = req.body.ingredients;
      var price = 0;

      Ingredient.find({_id: { $in: ingredients}}, function(err, ingredients) {
        for (var i = 0; i < ingredients.length; i++) {
          price += ingredients[i].price;
        }
        var newOrder = new Order({
          name: name,
          ingredients: ingredients,
          price: price,
          complete: false
        });
        newOrder.save(function (err) {
          if (err) {
            console.log("Problem saving newOrder", err);
          }
        });
        res.send({
          price: newOrder.price
        });
      });
    }

  },
  updateOrder: function(req, res) {
    var id = req.body.id;
    Order.remove({_id:id}, function() {
      res.send({
        success: true
      });
    });
  },
};

module.exports = routes;