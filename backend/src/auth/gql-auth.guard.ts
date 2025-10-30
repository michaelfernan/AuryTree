import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class GqlAuthGuard extends AuthGuard("jwt") {
  getRequest(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();

    // Para requisições HTTP
    if (ctx.req) {
      return ctx.req;
    }

    // Para subscriptions via WebSocket
    if (ctx.connection && ctx.connection.context) {
      return ctx.connection.context;
    }

    throw new UnauthorizedException("Request object not found in GraphQL context");
  }
}
