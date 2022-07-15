import {
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import ValidationException from './filter/validation.exception';

function toValidationError(
  error: ValidationError,
  parent: ValidationError[] = [],
  result = [],
) {
  if (error.children?.length) {
    error.children.forEach((childError) => {
      toValidationError(childError, [...parent, error], result);
    });
    return;
  }

  let property: string;

  if (parent.length) {
    if (error.constraints.nestedValidation != null) {
      property = parent.map((parentError) => parentError.property).join('.');
    } else {
      property = [...parent, error].map((parentError) => parentError.property).join('.');
    }
  } else {
    property = error.property;
  }

  result.push({
    property,
    message: Object.values(error.constraints)[0],
  });
}

function exceptionFactory(errors: ValidationError[]) {
  const exceptionError = [];
  errors.forEach((error) => toValidationError(error, [], exceptionError));
  return new ValidationException(exceptionError);
}

export default class CustomValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      ...options,
      exceptionFactory,
      whitelist: true,
    });
  }
}
