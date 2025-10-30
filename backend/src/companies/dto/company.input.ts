import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType({ description: 'Dados para criação de uma nova empresa' })
export class CreateCompanyInput {
  @Field({ description: 'Nome da empresa' })
  name: string;

  @Field({ description: 'CNPJ da empresa (único)' })
  cnpj: string;
}

@InputType({ description: 'Dados para atualização de uma empresa existente' })
export class UpdateCompanyInput extends PartialType(CreateCompanyInput) {
  @Field(() => ID, { description: 'Identificador único da empresa' })
  id: string;
}
