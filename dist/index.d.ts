export declare type Class = {
    name: string;
    new (...args: any[]): {};
};
export declare type validator = (x: unknown) => boolean;
export declare type Logger = {
    warn: (...args: any[]) => any;
};
export declare type primitive = string | boolean | number;
export declare type alphanumeric = string | number;
export declare class ValidationError extends Error {
    static getMessage(value: unknown, expectedType: string, name: string): string;
    constructor(value: unknown, expectedType: string, name: string);
}
/**
 * Set a validator for a given type. This validator can then be used from `checkType` with the specified type name.
 * @param {string} type			The name of the type.
 * @param {validator} validator	Validator function.
 * @param {string} [name]		Optional name. Will be displayed in the error messages instead of the type name.
 */
export declare function setValidator(type: string, validator: validator, name?: string): void;
/**
 * Sets the logger to use for warnings. Defaults to `console`.
 * @param logger
 */
export declare function setLogger(logger: Logger): void;
/**
 * Checks the type of the given value. Throws an error if the type is not correct, and a default is not provided.
 * @param value
 * @param {string} type			A predefined type.
 * @param {string} name			The name of the variable. Will be used for error/warning messages.
 * @param [defaultValue]		The default to use in case the value did not match the type.
 * @param {validator} [warnIf]	If a default value is applied, a warning will be issued if this function returns `true`.
 * 								Input of the function is the value. As default behaviour, warnings will not be issued
 * 								if the invalid value was `undefined` or `null`.
 */
export declare function checkType(value: unknown, type: string, name: string, defaultValue?: unknown, warnIf?: (x: unknown) => boolean): unknown;
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
export declare function safeParseNumber(value: unknown): number | null;
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
 * @param {Class} Parentgi
 * @param {boolean} [includeIdentity]	Determines whether Parent itself should be considered a sub-class (defaults to true).
 * @return {boolean}
 */
export declare function isSubClass(value: unknown, Parent: Class, includeIdentity?: boolean): value is Class;
