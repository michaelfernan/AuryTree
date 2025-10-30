import { InputType, Field, ID } from "@nestjs/graphql";
import { InvoiceType } from "../invoice.entity";

@InputType()
export class CreateInvoiceInput {
  @Field(() => ID)
  companyId: string;

  @Field(() => InvoiceType)
  type: InvoiceType; // ENTRADA | SAIDA

  @Field()
  issueDate: string; // "YYYY-MM-DD"

  @Field({ nullable: true })
  partnerCnpj?: string;

  @Field()
  total: string; // "25000.00"

  @Field({ nullable: true })
  nfeKey?: string;
}
