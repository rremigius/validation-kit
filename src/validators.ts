import {alphanumeric, check, Class, Constructor, isClass, isPrimitive, isSubClass, Validator} from "./index";
import {find, isArray, isBoolean, isNumber, isPlainObject, isString} from "./utils";

export const IS_NUMBER:Validator<number> = {
	validate: isNumber,
	expected: 'number'
}
export const IS_OBJECT:Validator<object> = {
	validate: isPlainObject,
	expected: 'plain object'
}
export const IS_BOOLEAN:Validator<boolean> = {
	validate: isBoolean,
	expected: 'boolean'
}
export const IS_STRING:Validator<string> = {
	validate: isString,
	expected: 'string'
}
export const IS_ARRAY:Validator<unknown[]> = {
	validate: isArray,
	expected: 'array'
}
export const IS_ALPHANUMERIC:Validator<alphanumeric> = {
	validate: x => isString(x) || isNumber(x),
	expected: 'alphanumeric'
}
export const IS_PRIMITIVE:Validator<alphanumeric> = {
	validate: isPrimitive,
	expected: 'primitive'
}
export const IS_CLASS:Validator<Class> = {
	validate: isClass,
	expected: 'class'
}

export function IS_ARRAY_OF<T>(validator:Validator<T>):Validator<T[]> {
	const expected = validator.expected || 'unspecified value';
	return {
		validate: (x:unknown) => {
			if(!isArray(x)) return false;
			return !find(x, item => {
				try { check<T>(item, validator); return false }
				catch(e) {return true;}
			})
		},
		expected: `array of ${expected}s`
	}
}
export function IS_INSTANCE_OF<T>(Class:Constructor<T>):Validator<T> {
	return {
		validate: x => x instanceof Class,
		expected: Class.name
	}
}
export function IS_SUBCLASS_OF<T>(Class:Constructor<T>, includeIndentity = true):Validator<T> {
	return {
		validate: x => isSubClass(x, Class, includeIndentity),
		expected: `subclass of ${Class.name}`
	}
}
