import { InputType, Field, ID } from "@nestjs/graphql";
import { ExpenseOrigin } from "../expense.entity";

@InputType()
export class CreateExpenseInput {
  @Field(() => ID)
  companyId: string;

  @Field()
  description: string;

  @Field()
  amount: string; // "3500.00"

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  dueDate?: string; // "YYYY-MM-DD"

  @Field({ nullable: true })
  paidAt?: string; // "YYYY-MM-DD"

  @Field(() => ExpenseOrigin, { nullable: true })
  origin?: ExpenseOrigin; // default: manual

  @Field({ nullable: true })
  invoiceId?: string;
}
