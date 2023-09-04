import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt'){
  constructor(private jwtService: JwtService) { 
    super();
  };

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = this.getRequest(context);
    const authHeader = req.headers.authorization as string;

    if (!authHeader) {
      throw new BadRequestException('Authorization header not found.');
    }

    const [type, token] = authHeader?.split(' ') ?? [];

    const jwt = type === 'Bearer' ? token : undefined;

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: 'secret'
        }
      );
      req.user = payload
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

}