// backend/src/some-resolver.ts
import { UseGuards } from "@nestjs/common";
import { Resolver, Query } from "@nestjs/graphql";
import { GqlAuthGuard } from "./auth/gql-auth.guard";
import { CurrentUser } from "./auth/current-user.decorator";

@Resolver()
export class ProfileResolver {
  @Query(() => String)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: any) {
    return `Você é ${user.email} (id ${user.id})`;
  }
}
