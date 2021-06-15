import {check} from "../src";
import {assert} from "chai";
import * as _ from "lodash";

describe("check", () => {
	it("returns unmodified input if it passes evaluator", () => {
		const input = {};
		assert.equal(check(input, _.isObject, "object"), input);
	});
	it("throws if input does not pass evaluator", () => {
		assert.throws(()=>check(1, _.isString, "string"));
		assert.throws(()=>check("a", _.isNumber, "number"));
	});
	it("with default returns the given default without throwing", () => {
		assert.equal(
			check(undefined, _.isNumber, "number", "value", {default: 1}),
			1
		);
		assert.equal(
			check(1, _.isString, "string", "value", {default: undefined}),
			undefined
		);
		assert.equal(
			check("a", _.isNumber, "number", "value", {default: ()=>2}),
			2
		);
	});
});
