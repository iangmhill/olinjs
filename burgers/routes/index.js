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
        var inStock;
        var price;
        if (!ingredients[i].inStock) {
          inStock = 'out-of-stock';
          name += ' (out of stock)';
        } else {
          inStock = '';
        }
        price = '$' + ingredients[i].price.toFixed(2);
        displayIngredients.push({name: name, price: price, inStock: inStock});
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
        var inStock;
        var price;
        var id = ingredients[i]._id;
        if (!ingredients[i].inStock) {
          inStock = 'out-of-stock';
          name += ' (out of stock)';
        } else {
          inStock = '';
        }
        price = '$' + ingredients[i].price.toFixed(2);
        displayIngredients.push({
          name: name,
          price: price,
          inStock: inStock,
          id: id
        });
      }
      res.render('order', {
        'ingredients': displayIngredients
      });
    });
  },
  kitchen: function(req, res) {
    return;

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
    return;

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
    return;
    
  },
};

module.exports = routes;