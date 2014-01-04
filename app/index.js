'use strict';

angular.module('datedirective', [])
    .controller('TestCtrl', function($scope) {
        $scope.date = new Date();
    });
