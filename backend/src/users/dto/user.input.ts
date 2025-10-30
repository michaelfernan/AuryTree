import { InputType, Field } from "@nestjs/graphql";
import { UserRole } from "../user.entity";

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string; // será hasheado no service

  @Field(() => UserRole, { nullable: true })
  role?: UserRole; // default OWNER
}

@InputType()
export class UpdateUserInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field(() => UserRole, { nullable: true })
  role?: UserRole;
}
