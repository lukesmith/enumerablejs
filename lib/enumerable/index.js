/*global window, copy: false, each: false, where: false */
/*jslint plusplus: false, onevar: false, nomen: false */
"use strict";

(function(exports){

	function ensureEnumerable(object) {
		///	<summary>
		///		1: _ensureEnumerable(array) - This function ensures the object is a Enumerable type.
		///		2: _ensureEnumerable(Enumerable) - This function ensures the object is a Enumerable type.
		///	</summary>
		///	<param name="object" type="Array">
		///     1: The object to check for whether it is an Enumerable object.
		///	</param>
		///	<returns type="Enumerable" />
		///	<private />
		if (object instanceof Enumerable) {
			return object;
		} else {
			return new Enumerable(object);
		}
	}

	function add(sequence, element) {
		///	<summary>
		///		This function adds an element to the sequence.
		///	</summary>
		///	<param name="sequence" type="Enumerable">
		///     The sequence to add the element to.
		///	</param>
		///	<param name="element" type="Object">
		///     The object to add.
		///	</param>
		///	<returns type="Enumerable" />
		sequence.elements.push(element);

		return sequence;
	}

	function addExpression(sequence, func, args) {
		var ret = copy(sequence);
		ret.expressions.push({ func: func, args: args });
		return ret;
	}

	function all(sequence, predicate) {
		///	<summary>
		///		Determines whether all elements of a sequence satisfy a condition.
		///	</summary>
		///	<param name="sequence" type="Enumerable">
		///     The sequence to check.
		///	</param>
		///	<param name="predicate" type="Function">
		///		A function to test each element of a condition.
		///	</param>
		///	<returns type="Boolean" />
		var ret = true;

		for (var i = 0; i < sequence.elements.length; i++) {
			if (!predicate(sequence.elements[i], i)) {
				ret = false;
				break;
			}
		}

		return ret;
	}

	function any(sequence, predicate) {
		///	<summary>
		///		1: any(sequence) - Determines whether a sequence contains any elements.
		///     2: any(sequence, predicate) - Determines whether any elements of a sequence satisfy a condition.
		///	</summary>
		///	<param name="sequence" type="Enumerable">
		///     The sequence to check.
		///	</param>
		///	<param name="predicate" type="Function" optional="true"> 
		///     1: A function to test each element of a condition.
		///	</param>
		///	<returns type="Boolean" />
		var ret = false;

		if (typeof predicate === "undefined" || predicate === null) {
			ret = sequence.elements.length !== 0;
		} else {
			for (var i = 0; i < sequence.elements.length; i++) {
				if (predicate(sequence.elements[i], i)) {
					ret = true;
					break;
				}
			}
		}

		return ret;
	}

	function average(sequence, selector) {
		/// <summary>
		///     1: average(sequence) - Computes the average of a sequence of values.
		///     2: average(sequence, selector) - Computes the average of the sequence using the specific selector to select the value for each element.
		/// </summary>
		///	<param name="sequence" type="Enumerable">
		///     The sequence to calculate the average of.
		///	</param>
		///	<param name="selector" type="Function" optional="true">
		///		A function to select the value to averafe.
		///	</param>
		///	<returns type="Number" />
		var sum = sequence.sum(selector);

		return sum / sequence.elements.length;
	}

	function concat(sequence, second) {
		///	<summary>
		///		Concatenates two sequences.
		///	</summary>
		///	<param name="sequence" type="Enumerable">
		///     The first sequence to concatenate.
		///	</param>
		///	<param name="second" type="Array">
		///		1: An array sequence to concatenate to the first sequence.
		///     2: A Enumerable object to concatenate to the first sequence.
		///	</param>
		///	<returns type="Enumerable" />
		return new Enumerable(sequence.elements.concat(ensureEnumerable(second).elements));
	}

	function contains(sequence, element, equalityComparer) {
		///	<summary>
		///		Determines whether an element is in the Enumerable object.
		///	</summary>
		///	<param name="element" type="Object">
		///		The object to locate in the Enumerable object.
		///	</param>
		///	<param name="equalityComparer" type="Function" optional="true">
		///		An equality comparer to compare to values.
		///	</param>
		///	<returns type="Boolean" />
		var ret = false;

		if (typeof equalityComparer === "undefined" || equalityComparer === null) {
			equalityComparer = sequence._defaultEqualityComparer;
		}

		for (var i = 0; i < sequence.elements.length; i++) {
			if (equalityComparer(sequence.elements[i], element)) {
				ret = true;
				break;
			}
		}

		return ret;
	}

	function count(sequence, predicate) {
		///	<summary>
		///     1: count() - Gets the number of elements actually contained in the Enumerable object.
		///		2: count(predicate) - Returns a number that represents how many elements in the Enumerable object satisfy a condition.
		///	</summary>
		///	<param name="predicate" type="Function" optional="true">
		///		A function to test each element for a condition.
		///	</param>
		///	<returns type="Number" />
		if (typeof predicate === "undefined" || predicate === null) {
			return sequence.elements.length;
		} else {
			var total = 0;

			var length = sequence.elements.length;
			for (var i = 0; i < length; i++) {
				if (predicate(sequence.elements[i], i)) {
					total++;
				}            
			}

			return total;
		}
	}

	function copy(sequence) {
		var ret = new Enumerable(sequence.elements);
		ret.expressions = sequence.expressions.slice();
		return ret;
	}

	function distinct(sequence, equalityComparer) {
		///	<summary>
		///     1: distinct() - Returns distinct elements from the Enumerable object.
		///		2: distinct(equalityComparer) - Returns distinct elements from the Enumerable object using the comparer to comparer elements.
		///	</summary>
		///	<param name="equalityComparer" type="Function" optional="true">
		///		A function to compare elements.
		///	</param>
		///	<returns type="Enumerable" />
		var ret = new Enumerable();

		var length = sequence.elements.length;
		for (var i = 0; i < length; i++) {
			var element = sequence.elements[i];
			if (!ret.contains(element, equalityComparer)) {
				add(ret, element);
			}
		}

		return ret;
	}

	function each(sequence, callback) {
		///	<summary>
		///		This function iterates through each element in the Enumerable object.
		///	</summary>
		///	<param name="callback" type="Function">
		///		The callback function to perform on each element in the Enumerable object.
		///	</param>
		///	<returns type="Enumerable" />
		var elements = sequence.toArray();

		var length = elements.length;
		for (var i = 0; i < length; i++) {
			callback(elements[i], i);
		}

		return sequence;
	}

	function elementAt(sequence, index) {
		///	<summary>
		///		Returns the element at the specified index in the Enumerable object.
		///	</summary>
		///	<param name="index" type="Number" integer="true">
		///		The zero-based index of the element in the Enumerable object.
		///	</param>
		///	<returns type="Object" />
		return sequence.elements[index];
	}

	function except(sequence, second, equalityComparer) {
		///	<summary>
		///		1: except(second) - Produces the set difference of two sequences by using the default equality comparer to compare values.
		///		2: except(second, equalityComparer) - Produces the set difference of two sequences by using the comparer to compare values.
		///	</summary>
		///	<param name="second" type="Array">
		///		1: An array.
		///		2: A Enumerable Object.
		///	</param>
		///	<param name="equalityComparer" type="Function" optional="true">
		///		A function to compare elements.
		///	</param>
		///	<returns type="Enumerable" />
		var parameterEnumerable = ensureEnumerable(second);

		if (typeof equalityComparer === "undefined" || equalityComparer === null) {
			equalityComparer = sequence._defaultEqualityComparer;
		}

		var ret = new Enumerable();

		var length = sequence.elements.length;
		for (var i = 0; i < length; i++) {
			var element = sequence.elements[i];

			if (!contains(parameterEnumerable, element, equalityComparer)) {
				add(ret, element);
			}
		}

		return ret;
	}

	function first(sequence, predicate) {
		///	<summary>
		///		1: first() - Returns the first element of the Enumerable object.
		///		2: first(predicate) - Returns the first element in a sequence that satisfies a specified condition.
		///	</summary>
		///	<param name="predicate" type="Function" optional="true">
		///		A function to test each element for a condition.
		///	</param>
		///	<returns type="Object" />
		if (typeof predicate === "undefined" || predicate === null) {
			return elementAt(sequence, 0);
		} else {
			for (var i = 0; i < sequence.elements.length; i++) {
				var element = sequence.elements[i];
				if (predicate(element, i)) {
					return element;
				}
			}

			return undefined;
		}
	}

	function firstOrDefault(sequence, predicate, defaultValue) {
		///	<summary>
		///		1: first(null, defaultValue) - Returns the first element of the Enumerable object.
		///		2: first(predicate, defaultValue) - Returns the first element in a sequence that satisfies a specified condition.
		///	</summary>
		///	<param name="predicate" type="Function" optional="true">
		///		A function to test each element for a condition.
		///	</param>
		///	<param name="defaultValue" type="Object">
		///		A defaultValue to return if no element is found.
		///	</param>
		///	<returns type="Object" />
		var ret = first(sequence, predicate);
		if (typeof ret === "undefined") {
			ret = defaultValue;
		}

		return ret;
	}

	function groupBy(sequence, keySelector, equalityComparer) {
		///	<summary>
		///		1: groupBy(keySelector) - Groups the elements of a sequence according to a specified key selector function.
		///		2: groupBy(keySelector, equalityComparer) - Groups the elements of a sequence according to a specified key selector function and compares the keys by using a specified comparer.
		///	</summary>
		///	<param name="keySelector" type="Function">
		///		A function to extract the key for each element.
		///	</param>
		///	<param name="equalityComparer" type="Function">
		///		A function to compare keys.
		///	</param>
		///	<returns type="Enumerable" />
		var ret = new Enumerable();

		if (typeof equalityComparer === "undefined" || equalityComparer === null) {
			equalityComparer = sequence._defaultEqualityComparer;
		}

		var length = sequence.elements.length;
		for (var i = 0; i < length; i++) {
			var element = sequence.elements[i];
			var currentKey = keySelector(element);
			var keyToAddTo = currentKey;

			var index = null;
			for (var j = 0; j < ret.elements.length; j++) {
				var key = ret.elements[j].key;
				if (equalityComparer(key, currentKey)) {
					keyToAddTo = key;
					index = j;
					break;
				}
			}

			if (index !== null) {
				add(ret.elements[index].values, element);
			} else {
				var t = new Enumerable();
				add(t, element);
				add(ret, { key: currentKey, values: t });
			}
		}

		return ret;
	}

	function indexOf(sequence, item, index, count) {
		///	<summary>
		///		1: indexOf(item) - Searches for the specified object and returns the zero-based index of the first occurrence within the entire Enumerable object.
		///		2: indexOf(item, index) - Searches for the specified object and returns the zero-based index of the first occurrence within the range of elements in the Enumerable object that extends from the specified index to the last element.
		///     3: indexOf(item, index, count) - Searches for the specified object and returns the zero-based index of the first occurrence within the range of elements in the Enumerable object that starts at the specified index and contains the specified number of elements.
		///	</summary>
		///	<param name="item" type="Object">
		///		The object to locate in the Enumerable object.
		///	</param>
		///	<param name="index" type="Number" integer="true" optional="true">
		///		The zero-based starting index of the search.
		///	</param>
		///	<param name="count" type="Number" integer="true" optional="true">
		///		The number of elements in the section to search.
		///	</param>
		///	<returns type="Number" />
		if (typeof index === "undefined" || index === null) {
			index = 0;
		}

		if (typeof count === "undefined" || count === null) {
			count = sequence.elements.length;
		}

		for (var i = index; i < count; i++) {
			if (item === sequence.elements[i]) {
				return i;
			}
		}

		return undefined;
	}

	function intersect(sequence, second, equalityComparer) {
		///	<summary>
		///		1: intersect(second) - Produces the set intersection of two sequences by using the default equality comparer to compare values.
		///		2: intersect(second, equalityComparer) - Produces the set intersection of two sequences by using the specified comparer to compare values.
		///	</summary>
		///	<param name="second" type="Array">
		///		1: An array whose distinct elements that also appear in the Enumerable sequence will be returned.
		///		2: An Enumerable whose distinct elements that also appear in the Enumerable sequence will be returned.
		///	</param>
		///	<param name="equalityComparer" type="Function" optional="true">
		///		A comparer to compare values.
		///	</param>
		///	<returns type="Enumerable" />
		var firstDistinct = distinct(sequence, equalityComparer);
		var secondDistinct = distinct(ensureEnumerable(second), equalityComparer);
		var ret = new Enumerable();

		var length = sequence.elements.length;
		for (var i = 0; i < length; i++) {
			var firstElement = sequence.elements[i];
			if (contains(secondDistinct, firstElement, equalityComparer)) {
				add(ret, firstElement);
			}
		}

		return ret;
	}

	function last(sequence, predicate) {
		///	<summary>
		///		1: last() - Returns the last element of a sequence.
		///		2: last() - Returns the last element of a sequence that satisfies a specified condition.
		///	</summary>
		///	<param name="predicate" type="Function" optional="true">
		///		A function to test each element for a condition.
		///	</param>
		///	<returns type="Object" />
		var ret = undefined;
		if (typeof predicate === "undefined" || predicate === null) {
			ret = sequence.elements[sequence.elements.length - 1];
		} else {
			var length = sequence.elements.length;

			for (var i = 0; i < length; i++) {
				var element = sequence.elements[i];
				if (predicate(element, i)) {
					ret = element;
				}
			}
		}

		return ret;
	}

	function lastOrDefault(sequence, predicate, defaultValue) {
		///	<summary>
		///		1: first(null, defaultValue) - Returns the last element of the Enumerable object.
		///		2: first(predicate, defaultValue) - Returns the last element in a sequence that satisfies a specified condition.
		///	</summary>
		///	<param name="predicate" type="Function" optional="true">
		///		A function to test each element for a condition.
		///	</param>
		///	<param name="defaultValue" type="Object">
		///		A defaultValue to return if no element is found.
		///	</param>
		///	<returns type="Object" />
		var ret = last(sequence, predicate);
		if (typeof ret === "undefined") {
			ret = defaultValue;
		}

		return ret;
	}

	function max(sequence, selector) {
		/// <summary>
		///     1: max() - Returns the maximum value in a sequence of values.
		///     2: max(selector) - Returns the maximum value of the Enumerable using the specific selector to select the value for each element.
		/// </summary>
		///	<param name="selector" type="Function" optional="true">
		///		A function to select the value to sum.
		///	</param>
		///	<returns type="Number" />
		if (sequence.elements.length === 0) {
			throw "Source contains no elements";
		}

		var ret = Number.MIN_VALUE;

		if (typeof selector === "undefined" || selector === null) {
			selector = sequence._defaultElementSelector;
		}

		var length = sequence.elements.length;
		for (var i = 0; i < length; i++) {
			var item = sequence.elements[i];
			var val = selector(item, i);
			if (val > ret) {
				ret = val;
			}
		}

		return ret;
	}

	function min(sequence, selector) {
		/// <summary>
		///     1: min() - Returns the minimum value in a sequence of values.
		///     2: min(selector) - Returns the minimum value of the Enumerable using the specific selector to select the value for each element.
		/// </summary>
		///	<param name="selector" type="Function" optional="true">
		///		A function to select the value to sum.
		///	</param>
		///	<returns type="Number" />
		if (sequence.elements.length === 0) {
			throw "Source contains no elements";
		}

		var ret = Number.MAX_VALUE;

		if (typeof selector === "undefined" || selector === null) {
			selector = sequence._defaultElementSelector;
		}

		var length = sequence.elements.length;
		for (var i = 0; i < length; i++) {
			var item = sequence.elements[i];
			var val = selector(item, i);
			if (val < ret) {
				ret = val;
			}
		}

		return ret;
	}

	function orderBy(sequence, keySelector, comparer) {
		/// <summary>
		///     1: orderBy(keySelector) - Sorts the elements of a sequence in ascending order according to a key.
		///     2: orderBy(keySelector, comparer) - Sorts the elements of a sequence in ascending order by using a specified comparer.
		/// </summary>
		///	<param name="keySelector" type="Function" optional="true">
		///		A function to extract a key from an element.
		///	</param>
		///	<param name="comparer" type="Function" optional="true">
		///		An comparer to compare keys.
		///	</param>
		///	<returns type="Enumerable" />
		if (typeof keySelector === "undefined" || keySelector === null) {
			keySelector = sequence._defaultKeySelector;
		}

		if (typeof comparer === "undefined" || comparer === null) {
			comparer = sequence._defaultComparer;
		}

		var ordered = new Enumerable(sequence.elements);

		ordered.elements.sort(function (a, b) {
			var aKey = keySelector(a);
			var bKey = keySelector(b);

			return comparer(aKey, bKey);
		});

		return ordered;
	}

	function orderByDescending(sequence, keySelector, comparer) {
		/// <summary>
		///     1: orderByDescending(keySelector) - Sorts the elements of a sequence in descending order according to a key.
		///     2: orderByDescending(keySelector, comparer) - Sorts the elements of a sequence in descending order by using a specified comparer.
		/// </summary>
		///	<param name="keySelector" type="Function" optional="true">
		///		A function to extract a key from an element.
		///	</param>
		///	<param name="comparer" type="Function" optional="true">
		///		An comparer to compare keys.
		///	</param>
		///	<returns type="Enumerable" />
		var ordered = orderBy(sequence, keySelector, comparer);

		ordered.elements.reverse();

		return ordered;
	}

	function reverse(sequence, index, count) {
		/// <summary>
		///     Reverses the order of the elements in a sequence.
		/// </summary>
		///	<param name="index" type="Number" integer="true" optional="true">
		///		The zero-based starting index of the range of elements to reverse.
		///	</param>
		///	<param name="count" type="Number" integer="true" optional="true">
		///		The number of elements to reverse.
		///	</param>
		///	<returns type="Enumerable" />
		if (count < 0) {
			throw "Count is out of range";
		}

		if (typeof index === "undefined" || index === null) {
			index = 0;
		}

		if (typeof count === "undefined" || count === null) {
			count = sequence.elements.length;
		}

		var first = sequence.elements.slice(0, index);
		var toReverse = sequence.elements.slice(index, index + count);
		var last = sequence.elements.slice(index + count, sequence.elements.length);

		return new Enumerable(first.concat(toReverse.reverse()).concat(last));
	}


	function select(sequence, selector) {
		var ret = new Enumerable();

		var length = sequence.elements.length;
		for (var i = 0; i < length; i++) {
			var item = sequence.elements[i];
			add(ret, selector(item, i));
		}

		return ret;
	}

	function selectMany(sequence, collectionSelector, resultSelector) {
		/// <summary>
		///     1: selectMany(collectionSelector) - Projects each element of a sequence to an Enumerable and flattens the resulting sequences into one sequence.
		///     2: selectMany(collectionSelector, resultSelector) - Projects each element of a sequence to an Enumerable, flattens the resulting sequences into one sequence, and invokes a result selector function on each element therein.
		/// </summary>
		///	<param name="collectionSelector" type="Function">
		///		A transform function to apply to each element of the input sequence.
		///	</param>
		///	<param name="resultSelector" type="Function" optional="true">
		///		A transform function to apply to each element of the intermediate sequence.
		///	</param>
		///	<returns type="Enumerable" />
		var ret = new Enumerable();
		var collectionItem;

		if (typeof resultSelector === "undefined" || resultSelector === null) {
			resultSelector = function (collectionItem, resultItem) {
				return resultItem;
			};
		}

		var addItemToReturn = function (item) {
			add(ret, resultSelector(collectionItem, item));
		};

		var length = sequence.elements.length;
		for (var i = 0; i < length; i++) {
			collectionItem = sequence.elements[i];
			var e = ensureEnumerable(collectionSelector(collectionItem, i));
			e.each(addItemToReturn);
		}

		return ret;
	}

	function sequenceEqual(sequence, second, equalityComparer) {
		/// <summary>
		///     1: sequenceEqual(second) - Determines whether two sequences are equal by comparing the elements by using the default equality comparer for their type.
		///     2: sequenceEqual(Enumerable) - Determines whether two sequences are equal by comparing the elements by using the default equality comparer for their type.
		///     3: sequenceEqual(second, equalityComparer) - Determines whether two sequences are equal by comparing their elements by using a specified equality comparer.
		/// </summary>
		///	<param name="second" type="Array" optional="true">
		///		1: An array to compare to the first sequence.
		///		2: A Enumerable to compare to the first sequence.
		///	</param>
		///	<param name="equalityComparer" type="Function" optional="true">
		///		A equality comparer to use to compare elements.
		///	</param>
		///	<returns type="Boolean" />
		var secondEnumerable = ensureEnumerable(second);
		var ret = true;

		if (sequence.elements.length !== secondEnumerable.elements.length) {
			ret = false;
		} else {
			if (typeof equalityComparer === "undefined" || equalityComparer === null) {
				equalityComparer = sequence._defaultEqualityComparer;
			}

			for (var i = 0; i < sequence.elements.length; i++) {
				if (!equalityComparer(sequence.elements[i], secondEnumerable.elementAt(i))) {
					ret = false;
					break;
				}
			}
		}

		return ret;
	}

	function single(sequence, predicate) {
		/// <summary>
		///     Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence.
		/// </summary>
		///	<param name="predicate" type="Function" optional="true">
		///		A function to test an element for a condition.
		///	</param>
		///	<returns type="Object" />
		if (typeof predicate === "undefined" || predicate === null) {
			if (sequence.elements.length === 1) {
				return sequence.elements[0];
			}
		} else {
			var found = where(sequence, predicate);

			if (found.elements.length === 1) {
				return found.elements[0];
			}
		}

		throw "The sequence should only contain one element";
	}

	function skip(sequence, count) {
		/// <summary>
		///     Bypasses a specified number of elements in a sequence and then returns the remaining elements.
		/// </summary>
		///	<param name="count" type="Number" integer="true">
		///		The number of elements to skip before returning the remaining elements.
		///	</param>
		///	<returns type="Enumerable" />
		var ret = new Enumerable();

		for (var i = count; i < sequence.elements.length; i++) {
			add(ret, sequence.elements[i]);
		}

		return ret;
	}

	function skipWhile(sequence, predicate) {
		/// <summary>
		///     Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
		/// </summary>
		///	<param name="predicate" type="Function">
		///		A function to test each element for a condition.
		///	</param>
		///	<returns type="Enumerable" />
		var ret = new Enumerable();

		var startReturning = false;
		each(sequence, function (item, index) {
			if (!startReturning) {
				if (!predicate(item, index)) {
					startReturning = true;
				}
			}

			if (startReturning) {
				add(ret, item);
			}
		});

		return ret;
	}

	function sum(sequence, selector) {
		/// <summary>
		///     1: sum() - Computes the sum of a sequence of values.
		///     2: sum(selector) - Computes the sum of the Enumerable using the specific selector to select the value for each element.
		/// </summary>
		///	<param name="selector" type="Function" optional="true">
		///		A function to select the value to sum.
		///	</param>
		///	<returns type="Number" />
		var ret = 0;

		if (typeof selector === "undefined" || selector === null) {
			selector = sequence._defaultElementSelector;
		}

		each(sequence, function (item, index) {
			ret += selector(item, index);
		});

		return ret;
	}

	function take(sequence, count) {
		/// <summary>
		///     Returns a specified number of contiguous elements from the start of a sequence.
		/// </summary>
		///	<param name="count" type="Number" integer="true">
		///		The number of elements to return.
		///	</param>
		///	<returns type="Enumerable" />
		if (count > sequence.elements.length) {
			throw "Cannot take more elements than exist.";
		}

		var ret = new Enumerable();

		for (var i = 0; i < count; i++) {
			add(ret, sequence.elements[i]);
		}

		return ret;
	}

	function takeWhile(sequence, predicate) {
		/// <summary>
		///     Returns elements from a sequence as long as a specified condition is true. 
		/// </summary>
		///	<param name="predicate" type="Function">
		///		A function to test each element for a condition.
		///	</param>
		///	<returns type="Enumerable" />
		var ret = new Enumerable();

		for (var i = 0; i < sequence.elements.length; i++) {
			var element = sequence.elements[i];

			if (predicate(element, i)) {
				add(ret, element);
			} else {
				break;
			}
		}

		return ret;
	}

	function toDictionary(selector, keySelector, elementSelector, equalityComparer) {
		/// <summary>
		///     1: toDictionary(keySelector) - Create a dictionary according to a specified key selector function;
		///     2: toDictionary(keySelector, null, equalityComparer) - Create a dictionary according to a specified key selector function and key comparer.
		///     3: toDictionary(keySelector, elementSelector) - Creates a dictionary according to specified key selector and element selector functions.
		///     4: toDictionary(keySelector, elementSelector, equalityComparer) - Creates a dictionary according to a specified key selector function, a comparer, and an element selector function.
		/// </summary>
		///	<param name="keySelector" type="Function">
		///		A function to extract a key from each element.
		///	</param>
		///	<param name="elementSelector" type="Function" optional="true">
		///		A transform function to produce a result element value from each element.
		///	</param>
		///	<param name="equalityComparer" type="Function" optional="true">
		///		A equality comparer function to compare keys.
		///	</param>
		///	<returns type="Object" />
		if (typeof equalityComparer === "undefined" || equalityComparer === null) {
			equalityComparer = selector._defaultEqualityComparer;
		}

		if (typeof elementSelector === "undefined" || elementSelector === null) {
			elementSelector = selector._defaultElementSelector;
		}

		var ret = {};
		var addedKeys = [];

		each(selector, function (item) {
			var key = keySelector(item);

			for (var i = 0; i < addedKeys.length; i++) {
				var existingKey = addedKeys[i];
				if (equalityComparer(key, existingKey)) {
					throw "An item with the same key has already been added.";
				}
			}

			ret[key] = elementSelector(item);
			addedKeys.push(key);
		});

		return ret;
	}

	function thenBy(sequence, keySelector, comparer) {
		throw "thenBy is not implemented.";
	}

	function thenByDescending(sequence, keySelector, comparer) {
		throw "thenByDescending is not implemented.";
	}

	function union(sequence, second, equalityComparer) {
		/// <summary>
		///     1: union(second) - Produces the set union of two sequences by using the default equality comparer.
		///     2: union(second, equalityComparer) - Produces the set union of two sequences by using a specified equality comparer.
		/// </summary>
		///	<param name="equalityComparer" type="Function" optional="true">
		///		A equality comparer function to compare values.
		///	</param>
		///	<returns type="Enumerable" />
		if (typeof equalityComparer === "undefined" || equalityComparer === null) {
			equalityComparer = sequence._defaultEqualityComparer;
		}

		var ret = new Enumerable();

		each(sequence, function (item) {
			if (!contains(ret, item, equalityComparer)) {
				add(ret, item);
			}
		});

		ensureEnumerable(second).each(function (item) {
			if (!contains(ret, item, equalityComparer)) {
				add(ret, item);
			}
		});

		return ret;
	}

	function where(sequence, predicate) {
		/// <summary>
		///     Filters a sequence of values based on a predicate.
		/// </summary>
		///	<param name="predicate" type="Function">
		///		A function to test each element for a condition.
		///	</param>
		///	<returns type="Enumerable" />
		var ret = new Enumerable();

		each(sequence, function (item) {
			if (predicate(item)) {
				add(ret, item);
			}
		});

		return ret;
	}

	function Enumerable(array) {
		///	<summary>
		///		1: $() - Creates an empty Enumerable object.
		///		2: $(array) - This function accepts an array.
		///	</summary>
		///	<param name="selector" type="Array">
		///		1: array - An array.
		///	</param>
		///	<returns type="Enumerable" />
		var elements = undefined;
		var expressions = [];

		if (typeof array === "undefined" || array === null) {
			array = [];
		}

		if (typeof array.length === "undefined") {
			var obj = array;
			array = [];
			array.push(obj);
		}

		function parseExpressions(sequence) {
			var tempSequence = new Enumerable(sequence.elements);
			var expression;
			var args;

			for (var expressionIndex = 0; expressionIndex < sequence.expressions.length; expressionIndex++) {
				expression = sequence.expressions[expressionIndex];
				args = [];
				args.push(tempSequence);
				for (var j = 0; j < expression.args.length; j++) {
					args.push(expression.args[j]);
				}

				tempSequence = expression.func.apply(tempSequence, args);
			}

			return tempSequence;
		}

		this.execute = function () {
			/// <summary>
			/// Executes the Enumerable query.
			/// </summary>
			/// <returns type="Enumerable" />
			return new Enumerable(this.toArray());
		};

		this.toArray = function () {
			/// <summary>
			///     Creates an array from an enumerable.
			/// </summary>
			///	<returns type="Array" />
			return parseExpressions.call(this, this).elements;
		};

		this.elements = array.slice();
		this.expressions = [];

		return this;
	};

	Enumerable.prototype = {
		_defaultEqualityComparer: function (element1, element2) {
			///	<private />
			return element1 === element2;
		},

		_defaultKeySelector: function (element) {
			///	<private />
			return element;
		},

		_defaultElementSelector: function (item, index) {
			///	<private />
			return item;
		},

		_defaultComparer: function (element1, element2) {
			///	<private />
			if (element1 === element2) {
				return 0;
			}

			if (typeof element1 === "undefined" || element1 === null) {
				return -1;
			}

			if (typeof element1 === "undefined" || element1 === null) {
				return 1;
			}

			if (element1 < element2) {
				return -1;
			} else if (element2 < element1) {
				return 1;
			}
		},

		all: function (predicate) {
			///	<summary>
			///		Determines whether all elements of a sequence satisfy a condition.
			///	</summary>
			///	<param name="predicate" type="Function">
			///		A function to test each element of a condition.
			///	</param>
			///	<returns type="Boolean" />
			return all(this.execute(), predicate);
		},

		any: function (predicate) {
			///	<summary>
			///		1: any() - Determines whether the Enumerable contains any elements.
			///     2: any(predicate) - Determines whether any elements of the Enumerable satisfy a condition.
			///	</summary>
			///	<param name="predicate" type="Function" optional="true"> 
			///     1: A function to test each element of a condition.
			///	</param>
			///	<returns type="Boolean" />
			return any(this.execute(), predicate);
		},

		average: function (selector) {
			/// <summary>
			///     1: average() - Computes the average of the Enumerable values.
			///     2: average(selector) - Computes the average of the Enumerable using the specific selector to select the value for each element.
			/// </summary>
			///	<param name="selector" type="Function" optional="true">
			///		A function to select the value to average.
			///	</param>
			///	<returns type="Number" />
			return average(this.execute(), selector);
		},

		concat: function (second) {
			///	<summary>
			///		Concatenates the sequence to the Enumerable.
			///	</summary>
			///	<param name="elements" type="Array">
			///		1: An array sequence to concatenate to the first sequence.
			///     2: A Enumerable object to concatenate to the first sequence.
			///	</param>
			///	<returns type="Enumerable" />
			return addExpression(this, concat, [second]);
		},

		contains: function (element, equalityComparer) {
			///	<summary>
			///		1: Determines whether an element is in the Enumerable object.
			///		2: Determines whether an element is in the Enumerable object using an equalityComparer.
			///	</summary>
			///	<param name="element" type="Object">
			///		The object to locate in the Enumerable object.
			///	</param>
			///	<param name="equalityComparer" type="Function" optional="true">
			///		An equality comparer to compare to values.
			///	</param>
			///	<returns type="Boolean" />
			return contains(this.execute(), element, equalityComparer);
		},

		count: function (predicate) {
			///	<summary>
			///     1: count() - Gets the number of elements actually contained in the Enumerable object.
			///		2: count(predicate) - Returns a number that represents how many elements in the Enumerable object satisfy a condition.
			///	</summary>
			///	<param name="predicate" type="Function" optional="true">
			///		A function to test each element for a condition.
			///	</param>
			///	<returns type="Number" />
			return count(this.execute(), predicate);
		},

		copy: function () {
			///	<summary>
			///     copy() - Copies the Enumerable.
			///	</summary>
			///	<returns type="Enumerable" />
			return copy(this);
		},

		distinct: function (equalityComparer) {
			///	<summary>
			///     1: distinct() - Returns distinct elements from the Enumerable object.
			///		2: distinct(equalityComparer) - Returns distinct elements from the Enumerable object using the comparer to comparer elements.
			///	</summary>
			///	<param name="equalityComparer" type="Function" optional="true">
			///		A function to compare elements.
			///	</param>
			///	<returns type="Enumerable" />
			return addExpression(this, distinct, [equalityComparer]);
		},

		each: function (callback) {
			///	<summary>
			///		This function iterates through each element in the Enumerable object.
			///	</summary>
			///	<param name="callback" type="Function">
			///		The callback function to perform on each element in the Enumerable object.
			///	</param>
			///	<returns type="Enumerable" />
			return each(new Enumerable(this.toArray()), callback);
		},

		elementAt: function (index) {
			///	<summary>
			///		Returns the element at the specified index in the Enumerable object.
			///	</summary>
			///	<param name="index" type="Number" integer="true">
			///		The zero-based index of the element in the Enumerable object.
			///	</param>
			///	<returns type="Object" />
			return elementAt(this.execute(), index);
		},

		except: function (second, equalityComparer) {
			///	<summary>
			///		1: except(second) - Produces the set difference of two sequences by using the default equality comparer to compare values.
			///		2: except(second, equalityComparer) - Produces the set difference of two sequences by using the comparer to compare values.
			///	</summary>
			///	<param name="second" type="Array">
			///		1: An array.
			///		2: A Enumerable Object.
			///	</param>
			///	<param name="equalityComparer" type="Function" optional="true">
			///		A function to compare elements.
			///	</param>
			///	<returns type="Enumerable" />
			return addExpression(this, except, [second, equalityComparer]);
		},

		first: function (predicate) {
			///	<summary>
			///		1: first() - Returns the first element of the Enumerable object.
			///		2: first(predicate) - Returns the first element in a sequence that satisfies a specified condition.
			///	</summary>
			///	<param name="predicate" type="Function" optional="true">
			///		A function to test each element for a condition.
			///	</param>
			///	<returns type="Object" />
			return first(this.execute(), predicate);
		},

		firstOrDefault: function (predicate, defaultValue) {
			///	<summary>
			///		1: first(null, defaultValue) - Returns the first element of the Enumerable object.
			///		2: first(predicate, defaultValue) - Returns the first element in a sequence that satisfies a specified condition.
			///	</summary>
			///	<param name="predicate" type="Function" optional="true">
			///		A function to test each element for a condition.
			///	</param>
			///	<param name="defaultValue" type="Object">
			///		A defaultValue to return if no element is found.
			///	</param>
			///	<returns type="Object" />
			return firstOrDefault(this.execute(), predicate, defaultValue);
		},

		groupBy: function (keySelector, equalityComparer) {
			///	<summary>
			///		1: groupBy(keySelector) - Groups the elements of a sequence according to a specified key selector function.
			///		2: groupBy(keySelector, equalityComparer) - Groups the elements of a sequence according to a specified key selector function and compares the keys by using a specified comparer.
			///	</summary>
			///	<param name="keySelector" type="Function">
			///		A function to extract the key for each element.
			///	</param>
			///	<param name="equalityComparer" type="Function">
			///		A function to compare keys.
			///	</param>
			///	<returns type="Enumerable" />
			return addExpression(this, groupBy, [keySelector, equalityComparer]);
		},

		indexOf: function (item, index, count) {
			///	<summary>
			///		1: indexOf(item) - Searches for the specified object and returns the zero-based index of the first occurrence within the entire Enumerable object.
			///		2: indexOf(item, index) - Searches for the specified object and returns the zero-based index of the first occurrence within the range of elements in the Enumerable object that extends from the specified index to the last element.
			///     3: indexOf(item, index, count) - Searches for the specified object and returns the zero-based index of the first occurrence within the range of elements in the Enumerable object that starts at the specified index and contains the specified number of elements.
			///	</summary>
			///	<param name="item" type="Object">
			///		The object to locate in the Enumerable object.
			///	</param>
			///	<param name="index" type="Number" integer="true" optional="true">
			///		The zero-based starting index of the search.
			///	</param>
			///	<param name="count" type="Number" integer="true" optional="true">
			///		The number of elements in the section to search.
			///	</param>
			///	<returns type="Number" />
			return indexOf(this.execute(), item, index, count);
		},

		intersect: function (second, equalityComparer) {
			///	<summary>
			///		1: intersect(second) - Produces the set intersection of two sequences by using the default equality comparer to compare values.
			///		2: intersect(second, equalityComparer) - Produces the set intersection of two sequences by using the specified comparer to compare values.
			///	</summary>
			///	<param name="second" type="Array">
			///		1: An array whose distinct elements that also appear in the Enumerable sequence will be returned.
			///		2: An Enumerable whose distinct elements that also appear in the Enumerable sequence will be returned.
			///	</param>
			///	<param name="equalityComparer" type="Function" optional="true">
			///		A comparer to compare values.
			///	</param>
			///	<returns type="Enumerable" />
			return addExpression(this, intersect, [second, equalityComparer]);
		},

		last: function (predicate) {
			///	<summary>
			///		1: last() - Returns the last element of a sequence.
			///		2: last() - Returns the last element of a sequence that satisfies a specified condition.
			///	</summary>
			///	<param name="predicate" type="Function" optional="true">
			///		A function to test each element for a condition.
			///	</param>
			///	<returns type="Object" />
			return last(this.execute(), predicate);
		},

		lastOrDefault: function (predicate, defaultValue) {
			///	<summary>
			///		1: first(null, defaultValue) - Returns the last element of the Enumerable object.
			///		2: first(predicate, defaultValue) - Returns the last element in a sequence that satisfies a specified condition.
			///	</summary>
			///	<param name="predicate" type="Function" optional="true">
			///		A function to test each element for a condition.
			///	</param>
			///	<param name="defaultValue" type="Object">
			///		A defaultValue to return if no element is found.
			///	</param>
			///	<returns type="Object" />
			return lastOrDefault(this.execute(), predicate, defaultValue);
		},

		max: function (selector) {
			/// <summary>
			///     1: max() - Returns the maximum value in a sequence of values.
			///     2: max(selector) - Returns the maximum value of the Enumerable using the specific selector to select the value for each element.
			/// </summary>
			///	<param name="selector" type="Function" optional="true">
			///		A function to select the value to sum.
			///	</param>
			///	<returns type="Number" />
			return max(this.execute(), selector);
		},

		min: function (selector) {
			/// <summary>
			///     1: min() - Returns the minimum value in a sequence of values.
			///     2: min(selector) - Returns the minimum value of the Enumerable using the specific selector to select the value for each element.
			/// </summary>
			///	<param name="selector" type="Function" optional="true">
			///		A function to select the value to sum.
			///	</param>
			///	<returns type="Number" />
			return min(this.execute(), selector);
		},

		orderBy: function (keySelector, comparer) {
			/// <summary>
			///     1: orderBy(keySelector) - Sorts the elements of a sequence in ascending order according to a key.
			///     2: orderBy(keySelector, comparer) - Sorts the elements of a sequence in ascending order by using a specified comparer.
			/// </summary>
			///	<param name="keySelector" type="Function" optional="true">
			///		A function to extract a key from an element.
			///	</param>
			///	<param name="comparer" type="Function" optional="true">
			///		An comparer to compare keys.
			///	</param>
			///	<returns type="Enumerable" />
			var ret = addExpression(this, orderBy, [keySelector, comparer]);

			//            var firstKeySelector = keySelector;
			//            var firstComparer = comparer;

			//            function _thenBy(keySelector, comparer) {
			//               var ret = addExpression(this, thenBy, [keySelector, comparer]);
			//                ret.thenBy = _thenBy;
			//                ret.thenByDescending = _thenByDescending;
			//                return ret;
			//            }

			//            function _thenByDescending(keySelector, comparer) {
			//                var ret = addExpression(this, thenByDescending, [keySelector, comparer]);
			//                ret.thenBy = _thenBy;
			//                ret.thenByDescending = _thenByDescending;
			//                return ret;
			//            }

			//            ret.thenBy = _thenBy;
			//            ret.thenByDescending = _thenByDescending;

			return ret;
		},

		orderByDescending: function (keySelector, comparer) {
			/// <summary>
			///     1: orderByDescending(keySelector) - Sorts the elements of a sequence in descending order according to a key.
			///     2: orderByDescending(keySelector, comparer) - Sorts the elements of a sequence in descending order by using a specified comparer.
			/// </summary>
			///	<param name="keySelector" type="Function" optional="true">
			///		A function to extract a key from an element.
			///	</param>
			///	<param name="comparer" type="Function" optional="true">
			///		An comparer to compare keys.
			///	</param>
			///	<returns type="Enumerable" />
			return addExpression(this, orderByDescending, [keySelector, comparer]);
		},

		reverse: function (index, count) {
			/// <summary>
			///     Reverses the order of the elements in a sequence.
			/// </summary>
			///	<param name="index" type="Number" integer="true" optional="true">
			///		The zero-based starting index of the range of elements to reverse.
			///	</param>
			///	<param name="count" type="Number" integer="true" optional="true">
			///		The number of elements to reverse.
			///	</param>
			///	<returns type="Enumerable" />
			return addExpression(this, reverse, [index, count]);
		},

		select: function (selector) {
			/// <summary>
			///     Projects each element of a sequence into a new form.
			/// </summary>
			///	<param name="selector" type="Function">
			///		A transform function to apply to each element.
			///	</param>
			///	<returns type="Enumerable" />
			return addExpression(this, select, [selector]);
		},

		selectMany: function (collectionSelector, resultSelector) {
			/// <summary>
			///     1: selectMany(collectionSelector) - Projects each element of a sequence to an Enumerable and flattens the resulting sequences into one sequence.
			///     2: selectMany(collectionSelector, resultSelector) - Projects each element of a sequence to an Enumerable, flattens the resulting sequences into one sequence, and invokes a result selector function on each element therein.
			/// </summary>
			///	<param name="collectionSelector" type="Function">
			///		A transform function to apply to each element of the input sequence.
			///	</param>
			///	<param name="resultSelector" type="Function" optional="true">
			///		A transform function to apply to each element of the intermediate sequence.
			///	</param>
			///	<returns type="Enumerable" />
			return addExpression(this, selectMany, [collectionSelector, resultSelector]);
		},

		sequenceEqual: function (second, equalityComparer) {
			/// <summary>
			///     1: sequenceEqual(second) - Determines whether two sequences are equal by comparing the elements by using the default equality comparer for their type.
			///     2: sequenceEqual(Enumerable) - Determines whether two sequences are equal by comparing the elements by using the default equality comparer for their type.
			///     3: sequenceEqual(second, equalityComparer) - Determines whether two sequences are equal by comparing their elements by using a specified equality comparer.
			/// </summary>
			///	<param name="second" type="Array" optional="true">
			///		1: An array to compare to the first sequence.
			///		2: A Enumerable to compare to the first sequence.
			///	</param>
			///	<param name="equalityComparer" type="Function" optional="true">
			///		A equality comparer to use to compare elements.
			///	</param>
			///	<returns type="Boolean" />
			return sequenceEqual(this.execute(), second, equalityComparer);
		},

		single: function (predicate) {
			/// <summary>
			///     Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence.
			/// </summary>
			///	<param name="predicate" type="Function" optional="true">
			///		A function to test an element for a condition.
			///	</param>
			///	<returns type="Object" />
			return single(this.execute(), predicate);
		},

		skip: function (count) {
			/// <summary>
			///     Bypasses a specified number of elements in a sequence and then returns the remaining elements.
			/// </summary>
			///	<param name="count" type="Number" integer="true">
			///		The number of elements to skip before returning the remaining elements.
			///	</param>
			///	<returns type="Enumerable" />
			return addExpression(this, skip, [count]);
		},

		skipWhile: function (predicate) {
			/// <summary>
			///     Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
			/// </summary>
			///	<param name="predicate" type="Function">
			///		A function to test each element for a condition.
			///	</param>
			///	<returns type="Enumerable" />
			return addExpression(this, skipWhile, [predicate]);
		},

		sum: function (selector) {
			/// <summary>
			///     1: sum() - Computes the sum of a sequence of values.
			///     2: sum(selector) - Computes the sum of the Enumerable using the specific selector to select the value for each element.
			/// </summary>
			///	<param name="selector" type="Function" optional="true">
			///		A function to select the value to sum.
			///	</param>
			///	<returns type="Number" />
			return sum(this.execute(), selector);
		},

		take: function (count) {
			/// <summary>
			///     Returns a specified number of contiguous elements from the start of a sequence.
			/// </summary>
			///	<param name="count" type="Number" integer="true">
			///		The number of elements to return.
			///	</param>
			///	<returns type="Enumerable" />
			return addExpression(this, take, [count]);
		},

		takeWhile: function (predicate) {
			/// <summary>
			///     Returns elements from a sequence as long as a specified condition is true. 
			/// </summary>
			///	<param name="predicate" type="Function">
			///		A function to test each element for a condition.
			///	</param>
			///	<returns type="Enumerable" />
			return addExpression(this, takeWhile, [predicate]);
		},

		toDictionary: function (keySelector, elementSelector, equalityComparer) {
			/// <summary>
			///     1: toDictionary(keySelector) - Create a dictionary according to a specified key selector function;
			///     2: toDictionary(keySelector, null, equalityComparer) - Create a dictionary according to a specified key selector function and key comparer.
			///     3: toDictionary(keySelector, elementSelector) - Creates a dictionary according to specified key selector and element selector functions.
			///     4: toDictionary(keySelector, elementSelector, equalityComparer) - Creates a dictionary according to a specified key selector function, a comparer, and an element selector function.
			/// </summary>
			///	<param name="keySelector" type="Function">
			///		A function to extract a key from each element.
			///	</param>
			///	<param name="elementSelector" type="Function" optional="true">
			///		A transform function to produce a result element value from each element.
			///	</param>
			///	<param name="equalityComparer" type="Function" optional="true">
			///		A equality comparer function to compare keys.
			///	</param>
			///	<returns type="Object" />
			return toDictionary(this.execute(), keySelector, elementSelector, equalityComparer);
		},

		union: function (second, equalityComparer) {
			/// <summary>
			///     1: union(second) - Produces the set union of two sequences by using the default equality comparer.
			///     2: union(second, equalityComparer) - Produces the set union of two sequences by using a specified equality comparer.
			/// </summary>
			///	<param name="equalityComparer" type="Function" optional="true">
			///		A equality comparer function to compare values.
			///	</param>
			///	<returns type="Enumerable" />
			return addExpression(this, union, [second, equalityComparer]);
		},

		where: function (predicate) {
			/// <summary>
			///     Filters a sequence of values based on a predicate.
			/// </summary>
			///	<param name="predicate" type="Function">
			///		A function to test each element for a condition.
			///	</param>
			///	<returns type="Enumerable" />
			return addExpression(this, where, [predicate]);
		}
	};    

	Enumerable.fromDictionary = function (dictionary) {
		/// <summary>
		///     Generates an Enumerable object from a dictionary object.
		/// </summary>
		///	<param name="dictionary" type="Object" integer="true">
		///		The object to create an Enumerable from.
		///	</param>
		///	<returns type="Enumerable" />
		var enumerable = new Enumerable();

		for (var keyName in dictionary) {
			if (typeof dictionary[keyName] !== 'function') {
				enumerable.add({ key: keyName, value: dictionary[keyName] });
			}
		}

		return enumerable;
	};

	Enumerable.range = function (start, count) {
		/// <summary>
		///     Generates a sequence of integral numbers within a specified range.
		/// </summary>
		///	<param name="start" type="Number" integer="true">
		///		The value of the first integer in the sequence.
		///	</param>
		///	<param name="count" type="Number" integer="true">
		///		The number of sequential integers to generate.
		///	</param>
		///	<returns type="Enumerable" />
		if (count < 0) {
			throw "Count is out of range.";
		}

		var ret = [];

		for (var i = start; i < start + count; i++) {
			ret.push(i);
		}

		return new Enumerable(ret);
	};

	Enumerable.repeat = function (item, count) {
		/// <summary>
		///     Generates a sequence that contains one repeated value.
		/// </summary>
		///	<param name="item" type="Object">
		///		The value to be repeated.
		///	</param>
		///	<param name="count" type="Number" integer="true">
		///		The number of times to repeat the value in the generated sequence.
		///	</param>
		///	<returns type="Enumerable" />
		if (count < 0) {
			throw "Count is out of range.";
		}

		var ret = [];

		for (var i = 0; i < count; i++) {
			ret.push(item);
		}

		return new Enumerable(ret);
	};

	exports.create = function (arg1) {
		return new Enumerable(arg1);
	};

	exports.range = function (start, count) {
		return Enumerable.range(start, count);
	};

	exports.repeat = function (item, count) {
		return Enumerable.repeat(item, count);
	};
	
})(typeof exports === 'undefined'? this['Enumerable']={}: exports);