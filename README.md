# express-ajsv-middleware
[express.js](https://github.com/visionmedia/express) middleware for validating requests against JSON Schema

<hr>

## Installation

```sh
$ npm install express-ajsv-middleware
```

`--save` is no longer necessary as of `npm@5`

## Getting started

Require the module
```js
const validateSchema = require('express-ajsv-middleware');
```

Example: Validate `req.body` against `bodySchema`

```js
app.post('/users/', validate(bodySchema), function(req, res) {
    // route code
});
```

## Example Express app

```js
var express = require('express');
var bodyParser = require('body-parser');

var validateSchema = require('express-ajsv-middleware');

// Define a JSON Schema
var createUser = {
  title: "new user",
  description: "describes properties required to create a user",
  type: "object",
  properties: {
    first: {
      type: "string",
      description: "firstname of the account user"
    },
    last: {
      type: "string",
      description: "lastname of the account user"
    },
    username: {
      type: "string",
      description: "username of account"
    },
    rememberEmail: {
      type: "boolean",
      description: "whether the users email address should be remembered"
    }
  },
  required: ["first", "last", "username", "rememberEmail"]
}


var app = express();

app.use(bodyParser.json());

// This route validates req.body against the StreetSchema
app.post('/users/', validateSchema(createUser), function(req, res) {
    // At this point req.body has been validated and you can
    // begin to execute your application code
    res.send('valid');
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