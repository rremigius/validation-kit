import _ from 'lodash';

export type Class = {
	name:string;
	new (...args: any[]): {};
};

export type validator = (x:unknown)=>boolean;
export type Logger = {
	warn: (...args:any[])=>any
}
export type Primitive = string|boolean|number;

// ---------------- State
const validators:{
	[key:string]: {
		name: string,
		function: validator
	}
} = {
	alphanumeric: { name: 'alphanumeric', function: isAlphanumeric },
	array: { name: 'array', function: _.isArray	},
	boolean: { name: 'boolean', function: _.isBoolean },
	function: { name: 'function', function: _.isFunction } ,
	number: { name: 'number', function: _.isNumber },
	object: { name: 'object', function: _.isPlainObject },
	string: {name: 'string', function: _.isString }
};
let log:Logger = console;
// ---------------- End State

function namePrefix(name?:string) {
	if(!name) return '';
	return `${name}: `;
}

function valueType(value:unknown) {
	return _.isFunction(value) ? value.name : value;
}

export class ValidationError extends Error {
	static getMessage(value:unknown, expectedType:string, name:string) {
		return `${namePrefix(name)}Expected ${expectedType}, ${valueType(value)} given.`;
	}

	constructor(value:unknown, expectedType:string, name:string) {
		super(ValidationError.getMessage(value, expectedType, name));
	}
}

/**
 * Set a validator for a given type. This validator can then be used from `checkType` with the specified type name.
 * @param {string} type			The name of the type.
 * @param {validator} validator	Validator function.
 * @param {string} [name]		Optional name. Will be displayed in the error messages instead of the type name.
 */
export function setValidator(type:string, validator:validator, name?:string) {
	if(name === undefined) name = type;
	validators[type] = {
		name: name,
		function: validator
	};
}

export function setLogger(logger:Logger) {
	log = logger;
}

export function checkType(
	value:unknown,
	type:string,
	name:string,
	defaultValue:unknown = undefined,
	warnIf:(x:unknown)=>boolean = (x:unknown)=>!_.isNil(x)
) {
	let valid = false;
	let expectedType = type;

	// Validate
	if(isClass(type)) {
		valid = value instanceof type;
		expectedType = `instance of ${type.name}`;
	} else if(_.isString(type)) {
		if(!(type in validators)) {
			return false;
		}
		const validate = validators[type].function;
		valid = validate(value);
	}

	// All good, just return value
	if(valid) {
		return value;
	}

	// Without default value we cannot continue and we have to throw an Error
	if(defaultValue === undefined) {
		throw new ValidationError(value, expectedType, name);
	}
	// Generate default value from given function
	if(_.isFunction(defaultValue)) {
		defaultValue = defaultValue(value);
	}
	// Should we provide a warning?
	if(warnIf(value)) {
		log.warn(`${namePrefix(name)}Expected ${type}, ${valueType(value)} given. Using default:`, defaultValue);
	}
	return defaultValue;
}

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
export function safeParseNumber(value:unknown):number|null {
	if (typeof value === 'number') return value;
	if (typeof value !== 'string') return null;

	// variable is string from here on
	let asNumber = parseFloat(value);
	if(isNaN(asNumber)) return null;

	return asNumber.toString() === value ? asNumber : null;
}

export function isPrimitive(value:unknown):value is Primitive {
	return _.isString(value) || _.isNumber(value) || _.isBoolean(value);
}

export function isClass(variable:unknown):variable is Class {
	return _.isFunction(variable);
}

export function isSubClass(value:unknown, Parent:Class, includeIdentity = true):value is Class {
	if(!isClass(value)) return false;

	return value.prototype instanceof Parent || (includeIdentity && value === Parent);
}
