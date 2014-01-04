'use strict';

angular.module('datedirective')
    .directive('date', function () {

        var EMPTY_VIEW_VALUE = {
            date: '1',
            month: '1',
            year: ''
        };

        return {
            templateUrl: 'date.html',
            restrict: 'E',
            replace: true,
            require: '?ngModel',
            link: function postLink(scope, element, attrs, ctrl) {
                if (!ctrl) {
                    return;
                }

                var dateInput = element.find('select').eq(0);
                var monthInput = element.find('select').eq(1);
                var yearInput = element.find('input');

                ctrl.$render = function() {
                    dateInput.val(ctrl.$viewValue ? ctrl.$viewValue.date : EMPTY_VIEW_VALUE.date);
                    monthInput.val(ctrl.$viewValue ? ctrl.$viewValue.month : EMPTY_VIEW_VALUE.month);
                    yearInput.val(ctrl.$viewValue ? ctrl.$viewValue.year : EMPTY_VIEW_VALUE.year);
                };

                function updateViewValue() {
                    var value = {
                        date: dateInput.val(),
                        month: monthInput.val(),
                        year: yearInput.val()
                    };

                    scope.$apply(function() {
                        ctrl.$setViewValue(value);
                    });
                }

                dateInput.on('change', updateViewValue);
                monthInput.on('change', updateViewValue);
                yearInput.on('input', updateViewValue);

                ctrl.$isEmpty = function(value) {
                    return !value || angular.equals(value, EMPTY_VIEW_VALUE);
                };

                // model -> view
                ctrl.$formatters.push(function(value) {
                    if (ctrl.$isEmpty(value)) {
                        ctrl.$setValidity('date', true);
                        return undefined;
                    } else if (angular.isDate(value)) {
                        ctrl.$setValidity('date', true);
                        return {
                            date: value.getDate(),
                            month: value.getMonth() + 1,
                            year: value.getFullYear()
                        };
                    } else {
                        ctrl.$setValidity('date', false);
                        return undefined;
                    }
                });

                // view -> model
                ctrl.$parsers.push(function(value) {
                    if (ctrl.$isEmpty(value)) {
                        ctrl.$setValidity('date', true);
                        return undefined;
                    } else {
                        var date = new Date(value.year, value.month - 1, value.date);
                        /* jshint -W116 */
                        var isValidDate = date.getDate() == value.date &&
                            date.getMonth() + 1 == value.month &&
                            date.getFullYear() == value.year;
                        /* jshint +W116 */
                        ctrl.$setValidity('date', isValidDate);
                        return isValidDate ? date : undefined;
                    }
                });
            }
        };
    });
