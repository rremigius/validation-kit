import Log from 'log-control';
declare const log: Log;
export declare type Class = {
    name: string;
    new (...args: any[]): {};
};
/**
 * Can be used as identifier for alphanumeric type.
 */
export declare class Alphanumeric {
}
export declare type validator = (x: unknown) => boolean;
export declare type primitive = string | boolean | number;
export declare type alphanumeric = string | number;
export declare type Constructor<T> = {
    new (...args: any[]): T;
};
export { log };
export declare class ValidationError extends Error {
    static getMessage(value: unknown, expectedType: string, name?: string): string;
    constructor(value: unknown, expectedType: string, name?: string);
}
export declare function check<T>(value: unknown, validator: (x: unknown) => boolean, expected: string, name?: string, options?: {
    default?: T | ((x: unknown) => T);
    warnIf?: (x: unknown) => boolean;
}): T;
/**
 * Checks if a value is a number or a string.
 * @param value
 * @return {boolean}
 */
export declare function isAlphanumeric(value: unknown): boolean;
/**
 * Attempts to parse the given value as a number. Returns `null` if not possible, or if parsed number is different from
 * the input string (e.g. leading zero was removed in the process).
 * @param {number} value
 * @return {number|null}
 */
export declare function parseNumberStrict(value: unknown): number | null;
/**
 * Checks if a value is a primitive (string/number/boolean).
 * @param value
 * @return {boolean}
 */
export declare function isPrimitive(value: unknown): value is primitive;
/**
 * Checks if a value is a class (or function).
 * @param variable
 * @return {boolean}
 */
export declare function isClass(variable: unknown): variable is Class;
/**
 * Checks if a value is a subclass of the given parent class.
 * @param value
 * @param {Class} Parent
 * @param {boolean} [includeIdentity]	Determines whether Parent itself should be considered a sub-class (defaults to true).
 * @return {boolean}
 */
export declare function isSubClass(value: unknown, Parent: Class, includeIdentity?: boolean): value is Class;
/**
 * Returns a validator function that checks if its argument is a subclass of the given parent class.
 * @param {Class} Parent
 * @param {boolean} [includeIdentity]	Determines whether Parent itself should be considered a sub-class (defaults to true).
 * @return {validator}
 */
export declare function subClass(Parent: Class, includeIdentity?: boolean): (value: unknown) => boolean;
/**
 * Returns a validator function that checks if its argument is an instance of the given class.
 * @param {Class} Class
 */
export declare function instanceOf(Class: Class): (value: unknown) => boolean;
