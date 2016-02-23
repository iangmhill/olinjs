// public/js/services/TodoService.js
app.service('TodoService', function($http, $q) {

  this.create = function(todoData) {
    var confirmation = $q.defer();
    $http.post('/api/createTodo', todoData)
      .then(function (response) {
        if (response.data.success) {
          confirmation.resolve({
            success: response.data.success,
            description: response.data.description,
            completed: response.data.completed,
            _id: response.data._id
          });
        } else {
          confirmation.resolve({
            success: response.data.success,
            message: response.data.message
          });
        }

      }, function (error) {
        console.log('ERROR: Promise error in TodoService', error);
        confirmation.reject(error);
      });
    return confirmation.promise;
  };

  this.edit = function(todoData) {
    var confirmation = $q.defer();
    $http.post('/api/editTodo', todoData)
      .then(function (response) {
        if (response.data.success) {
          confirmation.resolve({
            success: response.data.success,
            description: response.data.description,
            completed: response.data.completed,
            _id: response.data._id
          });
        } else {
          confirmation.resolve({
            success: response.data.success,
            message: response.data.message
          });
        }

      }, function (error) {
        console.log('ERROR: Promise error in TodoService', error);
        confirmation.reject(error);
      });
    return confirmation.promise;
  };

  this.delete = function(todoData) {
    var confirmation = $q.defer();
    $http.post('/api/deleteTodo', todoData)
      .then(function (response) {
        if (response.data.success) {
          confirmation.resolve({
            success: response.data.success
          });
        } else {
          confirmation.resolve({
            success: response.data.success,
            message: response.data.message
          });
        }

      }, function (error) {
        console.log('ERROR: Promise error in TodoService', error);
        confirmation.reject(error);
      });
    return confirmation.promise;
  };

  this.get = function() {
    var todos = $http.get('/api/getTodos').then(function (response) {
        return response.data;
      });
    return todos;
  };

});