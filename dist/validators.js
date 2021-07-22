import { check, isClass, isPrimitive, isSubClass } from "./index";
import { find, isArray, isBoolean, isNumber, isPlainObject, isString } from "./utils";
export const IS_NUMBER = {
    validate: isNumber,
    expected: 'number'
};
export const IS_OBJECT = {
    validate: isPlainObject,
    expected: 'plain object'
};
export const IS_BOOLEAN = {
    validate: isBoolean,
    expected: 'boolean'
};
export const IS_STRING = {
    validate: isString,
    expected: 'string'
};
export const IS_ARRAY = {
    validate: isArray,
    expected: 'array'
};
export const IS_ALPHANUMERIC = {
    validate: x => isString(x) || isNumber(x),
    expected: 'alphanumeric'
};
export const IS_PRIMITIVE = {
    validate: isPrimitive,
    expected: 'primitive'
};
export const IS_CLASS = {
    validate: isClass,
    expected: 'class'
};
export function IS_ARRAY_OF(validator) {
    const expected = validator.expected || 'unspecified value';
    return {
        validate: (x) => {
            if (!isArray(x))
                return false;
            return !find(x, item => {
                try {
                    check(item, validator);
                    return false;
                }
                catch (e) {
                    return true;
                }
            });
        },
        expected: `array of ${expected}s`
    };
}
export function IS_INSTANCE_OF(Class) {
    return {
        validate: x => x instanceof Class,
        expected: Class.name
    };
}
export function IS_SUBCLASS_OF(Class, includeIndentity = true) {
    return {
        validate: x => isSubClass(x, Class, includeIndentity),
        expected: `subclass of ${Class.name}`
    };
}
