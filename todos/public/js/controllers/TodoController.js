// public/js/controllers/TodoController.js
app.controller('TodoController', function($scope, TodoService) {

  $scope.isEditing = false;
  $scope.hiddenTodos = [];

  TodoService.get().then(function(todos) {
    for (var i = 0; i < todos.length; i++) {
      todos[i].editing = false;
      todos[i].strikethrough =
          todos[i].completed ? 'strikethrough' :'';
    }
    $scope.todos = todos;
  });

  $scope.createForm = function() {
    var confirmationPromise = TodoService.create({
      description: $scope.createDescription
    });
    confirmationPromise.then(
      function(confirmation) {
        if (confirmation.success) {
          confirmation.editing = false;
          $scope.todos.push(confirmation);
          $scope.createDescription = '';
        } else {
          $scope.createDescription = '';
        }
      },
      function(error) {
        console.log('ERROR: Promise error in TodoController', error);
      }
    );
  };

  $scope.edit = function(todo) {
    if ($scope.isEditing) {
      for (var i = 0; i < $scope.todos.length; i++) {
        $scope.todos[i].editing = false;
      }
    }
    $scope.isEditing = true;
    todo.editing = true;
    $scope.editDescription = todo.description;
  };

  $scope.editForm = function(todo, editDescription) {
    var confirmationPromise = TodoService.edit({
      id: todo._id,
      description: editDescription,
      completed: todo.completed
    });
    confirmationPromise.then(
      function(confirmation) {
        if (confirmation.success) {
          todo.editing = false;
          todo.description = confirmation.description;
          editDescription = '';
          $scope.isEditing = false;
        }
      },
      function(error) {
        console.log('ERROR: Promise error in TodoController', error);
      }
    );
  };

  $scope.done = function(todo) {
    var confirmationPromise = TodoService.edit({
      id: todo._id,
      description: todo.description,
      completed: !todo.completed
    });
    confirmationPromise.then(
      function(confirmation) {
        if (confirmation.success) {
          todo.completed = confirmation.completed;
          todo.strikethrough = todo.completed ? 'strikethrough' :'';
        }
      },
      function(error) {
        console.log('ERROR: Promise error in TodoController', error);
      }
    );
  };

  $scope.delete = function(todo) {
    var confirmationPromise = TodoService.delete({
      id: todo._id
    });
    confirmationPromise.then(
      function(confirmation) {
        console.log(confirmation);
        if (confirmation.success) {
          var index = $scope.todos.indexOf(todo);
          console.log(index);
          $scope.todos.splice(index, 1);     
        }
      },
      function(error) {
        console.log('ERROR: Promise error in TodoController', error);
      }
    );
  };

  $scope.filterCallback = function(category) {
    if (category == 'all') {
      $scope.todos = $scope.todos.concat($scope.hiddenTodos);
      $scope.hiddenTodos = [];
    } else {
      var newTodos = [];
      var newHiddenTodos = [];
      var check = (category == 'completed');
      for (var i = 0; i < $scope.todos.length; i++) {
        if ($scope.todos[i].completed == check) {
          newTodos.push($scope.todos[i]);
        } else {
          newHiddenTodos.push($scope.todos[i]);
        }
      }
      for (var i = 0; i < $scope.hiddenTodos.length; i++) {
        if ($scope.hiddenTodos[i].completed == check) {
          newTodos.push($scope.hiddenTodos[i]);
        } else {
          newHiddenTodos.push($scope.hiddenTodos[i]);
        }
      }
      $scope.todos = newTodos;
      $scope.hiddenTodos = newHiddenTodos;
    }
  };

  $scope.$parent.registerFilterCallback($scope.filterCallback);

});