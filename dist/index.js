"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMethods = exports.checkMethod = exports.isSubClass = exports.isClass = exports.isPrimitive = exports.safeParseNumber = exports.isAlphanumeric = exports.checkType = exports.setLogger = exports.setValidator = exports.ValidationError = void 0;
const lodash_1 = __importDefault(require("lodash"));
// ---------------- State
const validators = {
    alphanumeric: { name: 'alphanumeric', function: isAlphanumeric },
    array: { name: 'array', function: lodash_1.default.isArray },
    boolean: { name: 'boolean', function: lodash_1.default.isBoolean },
    function: { name: 'function', function: lodash_1.default.isFunction },
    number: { name: 'number', function: lodash_1.default.isNumber },
    object: { name: 'object', function: lodash_1.default.isPlainObject },
    string: { name: 'string', function: lodash_1.default.isString }
};
let log = console;
// ---------------- End State
function namePrefix(name) {
    if (!name)
        return '';
    return `${name}: `;
}
function valueType(value) {
    return lodash_1.default.isFunction(value) ? value.name : value;
}
class ValidationError extends Error {
    static getMessage(value, expectedType, name) {
        return `${namePrefix(name)}Expected ${expectedType}, ${valueType(value)} given.`;
    }
    constructor(value, expectedType, name) {
        super(ValidationError.getMessage(value, expectedType, name));
    }
}
exports.ValidationError = ValidationError;
/**
 * Set a validator for a given type. This validator can then be used from `checkType` with the specified type name.
 * @param {string} type			The name of the type.
 * @param {validator} validator	Validator function.
 * @param {string} [name]		Optional name. Will be displayed in the error messages instead of the type name.
 */
function setValidator(type, validator, name) {
    if (name === undefined)
        name = type;
    validators[type] = {
        name: name,
        function: validator
    };
}
exports.setValidator = setValidator;
function setLogger(logger) {
    log = logger;
}
exports.setLogger = setLogger;
function checkType(value, type, name, defaultValue = undefined, warnIf = (x) => !lodash_1.default.isNil(x)) {
    let valid = false;
    let expectedType = type;
    // Validate
    if (isClass(type)) {
        valid = value instanceof type;
        expectedType = `instance of ${type.name}`;
    }
    else if (lodash_1.default.isString(type)) {
        if (!(type in validators)) {
            return false;
        }
        const validate = validators[type].function;
        valid = validate(value);
    }
    // All good, just return value
    if (valid) {
        return value;
    }
    // Without default value we cannot continue and we have to throw an Error
    if (defaultValue === undefined) {
        throw new ValidationError(value, expectedType, name);
    }
    // Generate default value from given function
    if (lodash_1.default.isFunction(defaultValue)) {
        defaultValue = defaultValue(value);
    }
    // Should we provide a warning?
    if (warnIf(value)) {
        log.warn(`${namePrefix(name)}Expected ${type}, ${valueType(value)} given. Using default:`, defaultValue);
    }
    return defaultValue;
}
exports.checkType = checkType;
function isAlphanumeric(value) {
    // parseFloat can handle non-strings fine; it will just return NaN
    return !isNaN(parseFloat(value)) || lodash_1.default.isString(value);
}
exports.isAlphanumeric = isAlphanumeric;
/**
 * Attempts to parse the given value as a number. Returns `null` if not possible, or if parsed number is different from
 * the input string (e.g. leading zero was removed in the process).
 * @param {number} value
 * @return {number|null}
 */
function safeParseNumber(value) {
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
exports.safeParseNumber = safeParseNumber;
function isPrimitive(value) {
    return lodash_1.default.isString(value) || lodash_1.default.isNumber(value) || lodash_1.default.isBoolean(value);
}
exports.isPrimitive = isPrimitive;
function isClass(variable) {
    return lodash_1.default.isFunction(variable);
}
exports.isClass = isClass;
function isSubClass(SubClass, Class, includeIdentity = true) {
    if (!isClass(SubClass))
        return false;
    return SubClass.prototype instanceof Class || (includeIdentity && SubClass === Class);
}
exports.isSubClass = isSubClass;
function checkMethod(value, method, name) {
    if (!lodash_1.default.isObject(value) || !lodash_1.default.isFunction(lodash_1.default.get(value, method))) {
        throw new Error(`${namePrefix(name)}Missing method '${method}'.`);
    }
    return value;
}
exports.checkMethod = checkMethod;
function checkMethods(value, methods, name) {
    for (let method of methods) {
        checkMethod(value, method, name);
    }
    return value;
}
exports.checkMethods = checkMethods;
