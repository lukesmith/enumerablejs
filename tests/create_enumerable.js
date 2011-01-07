var common = require('../common');
var linq4node = require('../linq4node');

exports['Create an enumerable without a parameter'] = function(test) {
    var result = linq4node.enumerable();

    test.equal(result.count(), 0);
	test.done();
};

exports['Create an enumerable from an array'] = function(test) {
    var result = linq4node.enumerable([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    test.equal(result.count(), 10);
	test.done();
};

exports['Create an enumerable from an object thats not an array'] = function(test) {
    var result = linq4node.enumerable({ type: common.AnimalType.Dog, name: "Rover", age: 13, children: [] });

	test.equal(result.first().type, common.AnimalType.Dog);
	test.done();
};