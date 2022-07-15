import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpAdapterHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

const MESSAGE_MAP = {
  [HttpStatus.UNAUTHORIZED]: 'unauthorized',
  [HttpStatus.FORBIDDEN]: 'forbidden',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'internal_server_error',
  [HttpStatus.TOO_MANY_REQUESTS]: 'too_man_request',
};

@Catch()
export default class AllExceptionFilter implements ExceptionFilter {
  private logger = new Logger(AllExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const error = exception instanceof Error
      ? {
        message: exception.message,
        err: exception,
      }
      : { message: exception };

    if (!(exception instanceof HttpException)) {
      this.logger.error(error);
    }

    const httpStatus = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = exception instanceof HttpException
      ? { message: MESSAGE_MAP[httpStatus] || exception.message }
      : null;

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
