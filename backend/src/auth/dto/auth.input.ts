// backend/src/auth/dto/auth.input.ts
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class RegisterInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
