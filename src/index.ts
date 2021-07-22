import _ from 'lodash';
import Log from 'log-control';
import {isString} from "./utils";

const log = Log.instance("validation");

export type Class = {
	name:string;
	new (...args: any[]): {};
};

/**
 * Can be used as identifier for alphanumeric type.
 */
export class Alphanumeric {}

export type validator = (x:unknown)=>boolean;
export type primitive = string|boolean|number;
export type alphanumeric = string|number;

export type Constructor<T> = {
	new(...args: any[]): T;
};

export {log};

function namePrefix(name?:string) {
	if(!name) return '';
	return `${name}: `;
}

export function valueType(value:unknown) {
	return _.isFunction(value) ? value.name : value;
}

export class ValidationError extends Error {
	static getMessage(value:unknown, expectedType?:string, name?:string) {
		if(!expectedType) return `${namePrefix(name)}Invalid value; ${valueType(value)} given.`
		return `${namePrefix(name)}Expected ${expectedType}; ${valueType(value)} given.`;
	}

	constructor(value:unknown, expectedType?:string, name?:string) {
		super(ValidationError.getMessage(value, expectedType, name));
	}
}

export type ValidatorOptions<T> = {
	name?:string,
	default?: T|((x: unknown) => T),
	warn?: (x: unknown) => boolean
}
export type Validator<T> = {
	validate:(x:unknown)=>boolean,
	expected?:string,
	options?:ValidatorOptions<T>
};
export function check<T>(
	value:unknown,
	validator:Validator<T>|((x:unknown)=>boolean),
	options?: ValidatorOptions<T>|string
):T {
	if(_.isFunction(validator)) {
		validator = {
			validate: validator
		}
	}
	let name;
	if(isString(options)) {
		name = options;
		options = {};
	}
	let valid = validator.validate(value);
	if(valid) return <T>value;

	options = {...validator.options, ...options};

	if(options && 'default' in options) {
		let defaultValue = options.default;
		if(_.isFunction(defaultValue)) {
			defaultValue = defaultValue(value);
		}
		let shouldWarn = options && options.warn || ((x:unknown)=>!_.isNil(x));
		if(shouldWarn(value)) {
			log.warn(ValidationError.getMessage(value, validator.expected, name));
		}
		// TS: runtime check should match Type, that's the user's responsibility
		return <T><unknown>defaultValue;
	}
	throw new ValidationError(value, validator.expected, name);
}

/**
 * Checks if a value is a number or a string.
 * @param value
 * @return {boolean}
 */
export function isAlphanumeric(value:unknown) {
	// parseFloat can handle non-strings fine; it will just return NaN
	return !isNaN(parseFloat(value as any)) || _.isString(value);
}

/**
 * Attempts to parse the given value as a number. Returns `null` if not possible, or if parsed number is different from
 * the input string (e.g. leading zero was removed in the process).
 * @param {number} value
 * @return {number|null}
 */
export function parseNumberStrict(value:unknown):number|null {
	if (typeof value === 'number') return value;
	if (typeof value !== 'string') return null;

	// variable is string from here on
	let asNumber = parseFloat(value);
	if(isNaN(asNumber)) return null;

	return asNumber.toString() === value ? asNumber : null;
}

/**
 * Checks if a value is a primitive (string/number/boolean).
 * @param value
 * @return {boolean}
 */
export function isPrimitive(value:unknown):value is primitive {
	return _.isString(value) || _.isNumber(value) || _.isBoolean(value);
}

/**
 * Checks if a value is a class (or function).
 * @param variable
 * @return {boolean}
 */
export function isClass(variable:unknown):variable is Class {
	return _.isFunction(variable);
}

/**
 * Checks if a value is a subclass of the given parent class.
 * @param value
 * @param {Class} Parent
 * @param {boolean} [includeIdentity]	Determines whether Parent itself should be considered a sub-class (defaults to true).
 * @return {boolean}
 */
export function isSubClass(value:unknown, Parent:Class, includeIdentity = true):value is Class {
	if(!isClass(value)) return false;

	return value.prototype instanceof Parent || (includeIdentity && value === Parent);
}

/**
 * Returns a validator function that checks if its argument is a subclass of the given parent class.
 * @param {Class} Parent
 * @param {boolean} [includeIdentity]	Determines whether Parent itself should be considered a sub-class (defaults to true).
 * @return {validator}
 */
export function subClass(Parent:Class, includeIdentity = true) {
	return (value:unknown) => isSubClass(value, Parent, includeIdentity);
}

/**
 * Returns a validator function that checks if its argument is an instance of the given class.
 * @param {Class} Class
 */
export function instanceOf(Class:Class) {
	return (value:unknown) => value instanceof Class;
}
