import {check} from "../src";
import {assert} from "chai";
import * as _ from "lodash";
import {IS_ARRAY, IS_ARRAY_OF, IS_INSTANCE_OF, IS_NUMBER, IS_OBJECT, IS_STRING} from "../src/validators";

describe("check", () => {
	it("returns unmodified input if it passes evaluator", () => {
		const input = {};
		assert.equal(check(input, IS_OBJECT), input);
	});
	it("throws if input does not pass evaluator", () => {
		assert.throws(()=>check(1, IS_STRING));
		assert.throws(()=>check("a", IS_NUMBER));
	});
	it("with default returns the given default without throwing", () => {
		assert.equal(
			check(undefined, IS_NUMBER, {default: 1}),
			1
		);
		assert.equal(
			check(1, {validate: _.isString, options: {default:undefined}}),
			undefined
		);
		assert.equal(
			check("a", IS_NUMBER, {default: ()=>2}),
			2
		);
	});
	describe("INSTANCE_OF", () => {
		it("checks whether the value is an instance of the given class", () => {
			class Foo {}
			class Bar {}
			const foo = new Foo();
			assert.equal(check(foo, IS_INSTANCE_OF(Foo)), foo);
			assert.throws(()=>check(new Bar(), IS_INSTANCE_OF(Foo)));
		});
	});
	describe("ARRAY_OF", () => {
		it("checks whether the value has only items matching the given validator", () => {
			assert.doesNotThrow(()=>check([1,2,3], IS_ARRAY_OF(IS_NUMBER)));
			assert.throws(()=>check([1, '2', 3], IS_ARRAY_OF(IS_NUMBER)));

			class Foo {}
			assert.doesNotThrow(()=>check([new Foo(), new Foo()], IS_ARRAY_OF(IS_INSTANCE_OF(Foo))));
			assert.throws(()=>check([new Foo(), {}], IS_ARRAY_OF(IS_INSTANCE_OF(Foo))));
		});
	});
});
