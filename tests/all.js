var common = require('../common');
var linq4node = require('../linq4node');

exports['Array items of simple type'] = function(test) {
	var value = linq4node.enumerable([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).all(function(item) {
        return item >= 0;
    });
    test.equal(value, true);

    var value = linq4node.enumerable([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).all(function(item) {
        return item > 1;
    });
    test.equal(value, false);
	test.done();
};

exports['Enumerable items of complex type'] = function(test) {
	var value = linq4node.enumerable(common.animals).all(function(item) {
        return item.age >= 1;
    });
    test.equal(value, true);

    var value = linq4node.enumerable(common.animals).all(function(item) {
        return item.age >= 5;
    });
    test.equal(value, false);
	test.done();
};