// backend/src/auth/auth.resolver.ts
import { Resolver, Mutation, Args, Context } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { RegisterInput, LoginInput } from "./dto/auth.input";

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Boolean)
  async register(@Args("input") input: RegisterInput) {
    await this.authService.register(input.name, input.email, input.password);
    return true;
  }

  @Mutation(() => String)
  async login(@Args("input") input: LoginInput) {
    const result = await this.authService.login(input.email, input.password);
    // aqui retornamos só o token como string (você pode criar um type GraphQL se preferir)
    return result.token;
  }
}
