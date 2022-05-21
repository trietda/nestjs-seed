import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpAdapterHost,
} from '@nestjs/common';
import ValidationException from './validation.exception';

@Catch(ValidationException)
export default class ValidationExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: ValidationException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();
    const responseStatus = exception.getStatus()
    const responseBody = {
      message: exception.message,
      error: exception.error,
    };

    httpAdapter.reply(response, responseBody, responseStatus);
  }
}
