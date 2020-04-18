# express-ajsv-middleware
[express.js](https://github.com/visionmedia/express) middleware for validating requests against JSON Schema

<hr>

## Installation

```sh
$ npm install express-ajsv-middleware
```

`--save` is no longer necessary as of `npm@5`

## Getting started

1. Require the module
```js
var { Validator, ValidationError } = require('express-ajsv-middleware');
```

2. Initialize a Validator instance, optionally passing in an [ajv#options](https://github.com/epoberezkin/ajv#options) object

```js
var validator = new Validator({allErrors: true});
```

3. *Optional* - Define a bound shortcut function that can be used instead of Validator.validate
```js
var validate = validator.validate;
```

4. Use the Validator.validate method as an Express middleware, passing in an options object of the following format:
```js
Validator.validate(schemaToUse)
```

Example: Validate `req.body` against `bodySchema`

```js
app.post('/users/', validate(bodySchema), function(req, res) {
    // route code
});
```

## Error handling

On encountering erroneous data, the validator will call next() with a ValidationError object.
It is recommended to setup a general error handler for your app where you will catch ValidationError errors

Example - error thrown for the `body` request property

```js
ValidationError {
    name: 'JsonSchemaValidationError',
    validationErrors: {
        body: [AjvError]
    }
}
```

More information on [ajv#errors](https://github.com/epoberezkin/ajv#validation-errors)

## Example Express app

```js
var express = require('express');
var bodyParser = require('body-parser');

var { Validator, ValidationError } = require('express-ajsv-middleware');


// Initialize a Validator instance first
var validator = new Validator({allErrors: true}); // pass in options to the Ajv instance

// Define a shortcut function
var validate = validator.validate;

// Define a JSON Schema
var createUser = {
    properties: {
      body: {
        type: "object",
        required: ["username", "password", "mobileNumber"],
        username: {
          type: "string",
        },
        password: {
          type: "string",
        },
        mobileNumber: {
          type: "string",
          pattern: "/^[0-9][0-9]{9}$/",
        },
      },
    },
  }


var app = express();

app.use(bodyParser.json());

// This route validates req.body against the StreetSchema
app.post('/users/', validate(createUser), function(req, res) {
    // At this point req.body has been validated and you can
    // begin to execute your application code
    res.send('valid');
});

// Error handler for valication errors
app.use(function(err, req, res, next) {
    if (err instanceof ValidationError) {
        // At this point you can execute your error handling code
        res.status(400).send('invalid');
        next();
    }
    else next(err); // pass error on if not a validation error
});
```

## Validating multiple request properties

Sometimes your route may depend on the `body` and `query` both having a specific format.  In this example we use `body` and `query` but you can choose to validate any `request` properties you like. 

```js
var updateUser = {
    properties: {
      body: {
        type: "object",
        required: ["username", "password", "mobileNumber"],
        username: {
          type: "string",
        },
        password: {
          type: "string",
        },
        mobileNumber: {
          type: "string",
          pattern: "/^[0-9][0-9]{9}$/",
        },
      },
      query: {
        type: 'object', // req.query is of type object
        required: ['token'], // req.query.token is required
        properties: {
            uuid: { // validate token
                type: 'string', 
                format: 'uuid',
                minLength: 36,
                maxLength: 36
            }
        }
      },
    },
  }

app.post('/users/', Validator.validate(updateUser), function(req, res) {
    // application code
});
```


## More documentation on JSON schemas

- [spacetelescope's understanding json schema](http://spacetelescope.github.io/understanding-json-schema/)

## <a name="migrating"></a> Migrating from `express-jsonschema`

In `express-jsonschema`, you could define a required property in two ways. Ajv only supports one way of doing this.

```js
// CORRECT
{
    type: 'object',
    properties: {
        foo: {
            type: 'string'
        }
    },
    required: ['foo'] // <-- correct way
}

// WRONG
{
    type: 'object',
    properties: {
        foo: {
            type: 'string',
            required: true // nono way
        }
    }
}
```

## Credits

- Maintained by [@XManhit](https://github.com/xmanhit)
- [Original Module](https://github.com/JouzaLoL/express-json-validator-middleware) by [@JouzaLoL](https://github.com/JouzaLoL)
- PRs: see Contributors