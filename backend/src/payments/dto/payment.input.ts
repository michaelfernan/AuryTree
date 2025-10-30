import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { BeneficiaryType, PaymentSource } from '../payment.entity';

@InputType()
export class CreatePaymentInput {
  @Field(() => ID) companyId: string;

  @Field({ nullable: true }) expenseId?: string | null;
  @Field({ nullable: true }) employeeId?: string | null;

  @Field(() => BeneficiaryType, { nullable: true }) beneficiaryType?: BeneficiaryType;
  @Field() grossAmount: string;
  @Field() netAmount: string;

  @Field(() => PaymentSource, { nullable: true }) source?: PaymentSource;

  @Field({ nullable: true }) paidAt?: string | null;         // ISO date
  @Field({ nullable: true }) competence?: string | null;     // YYYY-MM
}

@InputType()
export class UpdatePaymentInput extends PartialType(CreatePaymentInput) {
  @Field(() => ID) id: string;
}
