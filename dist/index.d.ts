export declare type Class = {
    name: string;
    new (...args: any[]): {};
};
export declare type validator = (x: unknown) => boolean;
export declare type Logger = {
    warn: (...args: any[]) => any;
};
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
export declare function setLogger(logger: Logger): void;
export declare function checkType(value: unknown, type: string, name: string, defaultValue?: unknown, warnIf?: (x: unknown) => boolean): unknown;
export declare function isAlphanumeric(value: unknown): boolean;
/**
 * Attempts to parse the given value as a number. Returns `null` if not possible, or if parsed number is different from
 * the input string (e.g. leading zero was removed in the process).
 * @param {number} value
 * @return {number|null}
 */
export declare function safeParseNumber(value: unknown): number | null;
export declare function isPrimitive(value: unknown): boolean;
export declare function isClass(variable: unknown): variable is Class;
export declare function isSubClass(SubClass: unknown, Class: Class, includeIdentity?: boolean): boolean;
export declare function checkMethod(value: unknown, method: string, name?: string): object;
export declare function checkMethods(value: unknown, methods: string[], name?: string): unknown;
