import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateEmployeeInput {
  @Field()
  name: string;

  @Field({ description: 'Modelo de contrato: CLT | PJ | HORA...', nullable: true })
  model?: string;

  @Field({ nullable: true, description: 'Salário base (numeric como string)' })
  baseSalary?: string;

  // Use string ISO (YYYY-MM-DD) para evitar scalar custom de Date
  @Field({ nullable: true, description: 'Data de admissão (YYYY-MM-DD)' })
  admissionDate?: string;

  @Field(() => ID, { description: 'Empresa (companyId)' })
  companyId: string;

  @Field(() => ID, { nullable: true, description: 'User opcional vinculado' })
  userId?: string | null;
}

@InputType()
export class UpdateEmployeeInput extends PartialType(CreateEmployeeInput) {
  @Field(() => ID)
  id: string;
}
