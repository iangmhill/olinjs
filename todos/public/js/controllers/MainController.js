app.controller('MainController', function($scope, $location) {
  
  $scope.filter = 'all';
  $scope.filterCallbacks = [];

  $scope.registerFilterCallback = function(callback){
    $scope.filterCallbacks.push(callback);
  }

  $scope.filterChange = function() {
    console.log($scope.filterCallbacks);
    for (var i = 0; i < $scope.filterCallbacks.length; i++) {
      $scope.filterCallbacks[i]($scope.filter);
    }
  }

});