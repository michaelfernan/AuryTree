import { Field, ID, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class CreatePayrollItemInput {
  @Field(() => ID) companyId: string;
  @Field(() => ID) employeeId: string;

  @Field({ description: 'YYYY-MM' }) competence: string;

  @Field() gross: string;
  @Field() inss: string;
  @Field() fgts: string;
  @Field() net: string;
}

@InputType()
export class UpdatePayrollItemInput extends PartialType(CreatePayrollItemInput) {
  @Field(() => ID) id: string;
}
