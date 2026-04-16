import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Injectable()
export class JwtQueryGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): Request {
    const request = context.switchToHttp().getRequest<Request>();
    // Extract token from query parameter and set it in Authorization header
    // so the JWT strategy can process it
    const token = request.query.token as string;
    if (token) {
      request.headers.authorization = `Bearer ${token}`;
    }
    return request;
  }
}
