Validation Kit
===

Validation Kit is a set of common type checking functions, including single-line validation function to validate
variables and parameters. 

## Features

- Common type checking functions that are not common enough to be in [Lodash](https://lodash.com/).
- Single-line runtime validation function to check variable types, throw errors or use defaults.
- Single-line typescript validation function to reduce boilerplate code for runtime type checking.

## Functions

### `check(value, validator, options)`

**Arguments**:
- `value`: Input value to test.
- `validator`: (object) Specifies how to validate the value.
    - `validate`: (function) Takes the value as input and should provide a boolean output.
    - `expected`: (string) A description of the expected value.
    - `options`: (object, optional)
        - `name`: (string, optional) Name of the value to be used in error/warning messages. Defaults to 'value'.
        - `default`: Value to return if input value did not pass validation. Can be a function that takes input value as argument.
        - `warn`: (function) Function to determine whether a warning should be displayed. Default behaviour is that warnings
        are only displayed if a non-nil value was given.
- `options`: (object/string, optional) Overrides the options of the validator. If a string is provided, it will be treated as the `name` option.

**Returns**:
The value if it passed validation, the provided default value if it did not. Throws an error if value did not pass
validation and no default was provided.
                
**Usage**:

Javascript:

```javascript
// Simple example:
let fullName = check(123, {validator: _.isString, expected: "string"}); // will throw error

// Full example:
let fullName = check(123, { validator: _.isString, expected: 'string'}, {
	name: "fullName",
	default: "John Doe",
	warn(x) {
		return !_.isNil(x)
	}
});

// Using predefined validator object:
let fullName = check(123, IS_STRING, {default: "John Doe", warn: x => !_.isNil(x)})
```

Typescript:

```typescript
let fullName = check<string>(123, {validate: _.isString, expected: "string"});
```

Adding the dynamic type will let Typescript know the result is checked to be the given type. Make sure the dynamic type
matches the runtime type validator!

Using predefined validators, the return value of `check` will be typed accordingly:

```typescript
let fullName = check(123, IS_STRING); // TypeScript will determine fullName to be string
```

Custom validators can be predefined as well:

```typescript
const MY_VALIDATOR:Validator<MyType> = {
	validate: x => myValidation(x),
    expected: 'my validated value'
}
let value = check(123, MY_VALIDATOR);
```

### Functions

#### `instanceOf(Class)`

Returns a validator function that checks if an argument is of the given class.

- `Class`: (Class/function) Resulting validator will check if its argument is of this class.

**Example Usage**:

```typescript
let peter = new Person();
check(peter, instanceOf(Person), 'Person'); // ok
```

#### `parseNumberStrict(value)`

Attempts to parse the given string to a number, but only if the string representation of the resulting number is the
same as the input string.

- `value`: (string) string to parse to number

**Example Usage**:

```typescript
parseNumberStrict("1.2"); // 1.2
parseNumberStrict([]); // null
parseNumberStrict("01"); // null (whereas parseFloat would parse as 1)
parseNumberStrict("1.20"); // null (whereas parseFloat would parse as 1.2)
```

#### `subClass(Parent, includeIdentity)`

Returns a validator function that checks if an argument is a subclass of the given class.

- `Parent`: (Class/function) Resulting validator will check if its argument is a subclass of this class.
- `includeIdentity`: (boolean, optional) Determines whether the Parent class itself should return `true` in the validator.
    Defaults to `true`.

**Example Usage**:

```typescript
class Animal {}
class Cow extends Animal {}
check(Cow, subClass(Animal), "subclass of Animal"); // ok
check(Animal, subClass(Animal), "subclass of Animal"); // ok
check(Animal, subClass(Animal, false), "subclass of Animal"); // error 
```

### Classes

#### `ValidationError extends Error`

An error to be thrown when validation fails for some value.

#### `constructor(value, expectedType, name)`

- `value`: Value that was validated
- `expectedType`: (string) Description of the type
- `name`: (string, optional) Name of the validated value

#### `static getMessage(value, expectedType, name)`

Generates a human-readable error message as to why validation failed for the given value.

- `value`: Value that was validated
- `expectedType`: (string) Description of the type
- `name`: (string, optional) Name of the validated value
- **returns**: (string) Error message

### Validators

Below is an overview of included validators, and what a `true` return value of these validators means:

- `isAlphanumeric`: argument is string or number
- `isClass`: argument is a function (semantic alias of Lodash's `isFunction`)
- `isPrimitive`: argument is string, number or boolean
