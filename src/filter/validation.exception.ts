import { BadRequestException } from "@nestjs/common";

type ErrorDetail = {
  property: string;
  message: string;
};

export default class ValidationException extends BadRequestException {
  public error: ErrorDetail[];

  get hasError() {
    return this.error.length > 0;
  }

  constructor(error: ErrorDetail[] = [], message = 'bad_request') {
    super(message);
    this.error = error;
  }

  public addError(property: string, message: string): void {
    this.error.push({ property, message });
  }
}
