import _ from 'lodash';
import Log from 'log-control';
import { isString } from "./utils";
const log = Log.instance("validation");
/**
 * Can be used as identifier for alphanumeric type.
 */
export class Alphanumeric {
}
export { log };
function namePrefix(name) {
    if (!name)
        return '';
    return `${name}: `;
}
export function valueType(value) {
    return _.isFunction(value) ? value.name : value;
}
export class ValidationError extends Error {
    static getMessage(value, expectedType, name) {
        if (!expectedType)
            return `${namePrefix(name)}Invalid value; ${valueType(value)} given.`;
        return `${namePrefix(name)}Expected ${expectedType}; ${valueType(value)} given.`;
    }
    constructor(value, expectedType, name) {
        super(ValidationError.getMessage(value, expectedType, name));
    }
}
export function check(value, validator, options) {
    if (_.isFunction(validator)) {
        validator = {
            validate: validator
        };
    }
    let name;
    if (isString(options)) {
        name = options;
        options = {};
    }
    let valid = validator.validate(value);
    if (valid)
        return value;
    options = { ...validator.options, ...options };
    if (options && 'default' in options) {
        let defaultValue = options.default;
        if (_.isFunction(defaultValue)) {
            defaultValue = defaultValue(value);
        }
        let shouldWarn = options && options.warn || ((x) => !_.isNil(x));
        if (shouldWarn(value)) {
            log.warn(ValidationError.getMessage(value, validator.expected, name));
        }
        // TS: runtime check should match Type, that's the user's responsibility
        return defaultValue;
    }
    throw new ValidationError(value, validator.expected, name);
}
/**
 * Checks if a value is a number or a string.
 * @param value
 * @return {boolean}
 */
export function isAlphanumeric(value) {
    // parseFloat can handle non-strings fine; it will just return NaN
    return !isNaN(parseFloat(value)) || _.isString(value);
}
/**
 * Attempts to parse the given value as a number. Returns `null` if not possible, or if parsed number is different from
 * the input string (e.g. leading zero was removed in the process).
 * @param {number} value
 * @return {number|null}
 */
export function parseNumberStrict(value) {
    if (typeof value === 'number')
        return value;
    if (typeof value !== 'string')
        return null;
    // variable is string from here on
    let asNumber = parseFloat(value);
    if (isNaN(asNumber))
        return null;
    return asNumber.toString() === value ? asNumber : null;
}
/**
 * Checks if a value is a primitive (string/number/boolean).
 * @param value
 * @return {boolean}
 */
export function isPrimitive(value) {
    return _.isString(value) || _.isNumber(value) || _.isBoolean(value);
}
/**
 * Checks if a value is a class (or function).
 * @param variable
 * @return {boolean}
 */
export function isClass(variable) {
    return _.isFunction(variable);
}
/**
 * Checks if a value is a subclass of the given parent class.
 * @param value
 * @param {Class} Parent
 * @param {boolean} [includeIdentity]	Determines whether Parent itself should be considered a sub-class (defaults to true).
 * @return {boolean}
 */
export function isSubClass(value, Parent, includeIdentity = true) {
    if (!isClass(value))
        return false;
    return value.prototype instanceof Parent || (includeIdentity && value === Parent);
}
/**
 * Returns a validator function that checks if its argument is a subclass of the given parent class.
 * @param {Class} Parent
 * @param {boolean} [includeIdentity]	Determines whether Parent itself should be considered a sub-class (defaults to true).
 * @return {validator}
 */
export function subClass(Parent, includeIdentity = true) {
    return (value) => isSubClass(value, Parent, includeIdentity);
}
/**
 * Returns a validator function that checks if its argument is an instance of the given class.
 * @param {Class} Class
 */
export function instanceOf(Class) {
    return (value) => value instanceof Class;
}
