var common = require('../common');
var linq4node = require('../linq4node');

exports['Array items of integers'] = function(test) {
    var value = linq4node.enumerable([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).average();
    test.equal(value, 4.5);
	test.done();
};

exports['Array items of complex object'] = function(test) {
    var value = linq4node.enumerable(common.animals).average(function(item) {
        return item.age;
    });
    test.equal(value, 6.1);
	test.done();
};