'use strict';

describe('Directive: date', function () {

    // load the directive's module
    beforeEach(module('datedirective'));

    // load the directive's template
    beforeEach(module('date.html'));

    var $compile,
        element,
        scope;

    beforeEach(inject(function (_$compile_, $rootScope) {
        $compile = _$compile_;
        scope = $rootScope.$new();
    }));

    it('should support 2-way data binding via ng-model', function() {
        element = angular.element('<date ng-model="testDate"></date>');
        element = $compile(element)(scope);
        scope.testDate = new Date(2013, 11, 31);
        scope.$digest();

        expect(find(element, '[name=date]').val()).toBe('31');
        expect(find(element, '[name=month]').val()).toBe('12');
        expect(find(element, '[name=year]').val()).toBe('2013');

        enterDate('2013', '12', '31');

        expect(scope.testDate).toEqual(new Date(2013, 11, 31));

        scope.testDate = null;
        scope.$digest();
        expect(find(element, '[name=date]').val()).toBe('1');
        expect(find(element, '[name=month]').val()).toBe('1');
        expect(find(element, '[name=year]').val()).toBe('');
    });

    it('should empty the inputs if date is undefined', function() {
        element = angular.element('<date ng-model="testDate"></date>');
        element = $compile(element)(scope);
        scope.$digest();

        expect(scope.testDate).toBeUndefined();
        expect(find(element, '[name=date]').val()).toBe('1');
        expect(find(element, '[name=month]').val()).toBe('1');
        expect(find(element, '[name=year]').val()).toBe('');
    });

    describe('validations', function() {

        it('model -> view: date validation', function() {
            element = angular.element('<date ng-model="testDate"></date>');
            element = $compile(element)(scope);
            scope.testDate = new Date(2013, 11, 31);
            scope.$digest();
            var ngModel = element.controller('ngModel');

            expect(ngModel.$valid).toBe(true);

            scope.testDate = 'xxx';
            scope.$digest();

            expect(ngModel.$valid).toBe(false);
            expect(ngModel.$error).toEqual({date: true});

            // it should ignore empty model because it is not required
            scope.testDate = null;
            scope.$digest();
            expect(ngModel.$valid).toBe(true);
        });

        it('model -> view: required validation', function() {
            element = angular.element('<date ng-model="testDate" ng-required="true"></date>');
            element = $compile(element)(scope);
            scope.$digest();
            var ngModel = element.controller('ngModel');

            expect(ngModel.$valid).toBe(false);
            expect(ngModel.$error).toEqual({required: true, date: false});
        });

        it('view -> model: date validation', function() {
            element = angular.element('<date ng-model="testDate"></date>');
            element = $compile(element)(scope);
            scope.$digest();
            var ngModel = element.controller('ngModel');

            enterDate('2014', '12', '31');
            expect(ngModel.$valid).toBe(true);

            enterDate('2014', '2', '31');
            expect(ngModel.$valid).toBe(false);
            expect(ngModel.$error).toEqual({date: true});

            enterDate('2014', '2', '29');
            expect(ngModel.$valid).toBe(false);
            expect(ngModel.$error).toEqual({date: true});
        });

        it('view -> model: required validation', function() {
            element = angular.element('<date ng-model="testDate" ng-required="true"></date>');
            element = $compile(element)(scope);
            scope.$digest();
            var ngModel = element.controller('ngModel');

            enterDate('2014', '12', '31');
            expect(ngModel.$valid).toBe(true);

            enterDate('', '1', '1');
            expect(ngModel.$valid).toBe(false);
            expect(ngModel.$error).toEqual({required: true, date: false});
        });
    });

    // custom find function, because jqLite supports only lookup by tag name in .find
    function find(element, selector) {
        return angular.element(element[0].querySelectorAll(selector));
    }

    function enterDate(year, month, date) {
        find(element, '[name=date]').val(date).triggerHandler('change');
        find(element, '[name=month]').val(month).triggerHandler('change');
        find(element, '[name=year]').val(year).triggerHandler('input');
    }
});
