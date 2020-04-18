var Ajv = require("ajv");

/**
 * Express middleware for validating requests
 *
 * @class Validator
 */
class Validator {
  constructor(ajvOptions) {
    this.ajv = new Ajv(ajvOptions);
    this.validate = this.validate.bind(this);
  }

  /**
   * Validator method to be used as middleware
   *
   * @param {Object} options Options in format schema
   * @returns
   */
  validate(schema) {
    // The actual middleware function
    return (req, res, next) => {
      const requestProperty = schema.properties;
      const validateFunction = this.ajv.compile(schema);
      // Test if property is valid
      const valid = validateFunction(req[requestProperty]);
      if (!valid) {
        next(new ValidationError(validateFunction.errors));
      } else {
        next();
      }
    };
  }
}

/**
 * Validation Error
 *
 * @class ValidationError
 * @extends {Error}
 */
class ValidationError extends Error {
  constructor(validationErrors) {
    super();
    this.name = "JsonSchemaValidationError";
    this.validationErrors = validationErrors;
  }
}

module.exports = {
  Validator,
  ValidationError,
};
