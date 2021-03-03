Validation Kit
===

Validation Kit is a set of common type checking functions, including single-line validation function to validate
variables and parameters. 

## Features

- Common type checking functions that are not common enough to be in [Lodash](https://lodash.com/).
- Single-line runtime validation function to check variable types, throw errors or use defaults.
- Single-line typescript validation function to reduce boilerplate code for runtime type checking.

## Functions

### `check(value, validator, expected, name, options)`

**Arguments**:
- `value`: Input value to test.
- `validator`: (function) Takes the input value and returns a boolean.
- `expected`: (string) Description of the expected type. Used in error/warning messages.
- `name`: (string, optional) Name of the value to be used in error/warning messages. Defaults to 'value'.
- `options`: (object, optional)
    - `default`: Value to return if input value did not pass validation. Can be a function that takes input value as argument.
    - `warnIf`: (function) Function to determine whether a warning should be displayed. Default behaviour is that warnings
                are only displayed if a non-nil value was given.

**Returns**:
The value if it passed validation, the provided default value if it did not. Throws an error if value did not pass
validation and no default was provided.
                
**Usage**:

Javascript:

```javascript
// Simple example:
let fullName = check(123, _.isString, "string"); // will throw error
// Full example:
let fullName = check(123, _.isString, "string", "fullName", {
    default: "John Doe", 
    warnIf(x) { return _.isNumber(x) }
});
```

Typescript:

```typescript
let fullName = check<string>(123, _.isString, "string");
```

Adding the dynamic type will let Typescript know the result is checked to be the given type. Make sure the dynamic type
matches the runtime type validator!

### TODO: add included validators 
