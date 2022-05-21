import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpAdapterHost,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

@Catch(NotFoundException)
export default class NotFoundExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const responseBody = { message: 'not_found' };

    httpAdapter.reply(ctx.getResponse(), responseBody, HttpStatus.NOT_FOUND);
  }
}
