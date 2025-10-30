import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CreateCompanyInput, UpdateCompanyInput } from './dto/company.input';

@Resolver(() => Company)
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  // 📄 Lista todas as empresas
  @Query(() => [Company], { name: 'companies', description: 'Lista todas as empresas cadastradas' })
  findAll() {
    return this.companyService.findAll();
  }

  // 🔍 Busca uma empresa pelo ID
  @Query(() => Company, { name: 'company', nullable: true, description: 'Busca uma empresa pelo ID' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.companyService.findOne(id);
  }

  // 🧱 Criação de empresa (boa prática: via input)
  @Mutation(() => Company, { name: 'createCompany', description: 'Cria uma nova empresa' })
  create(@Args('input') input: CreateCompanyInput) {
    return this.companyService.create(input);
  }

  // ✏️ Atualização
  @Mutation(() => Company, { name: 'updateCompany', description: 'Atualiza dados de uma empresa existente' })
  update(@Args('input') input: UpdateCompanyInput) {
    const { id, ...patch } = input;
    return this.companyService.update(id, patch);
  }

  // ❌ Exclusão
  @Mutation(() => Boolean, { name: 'deleteCompany', description: 'Remove uma empresa pelo ID' })
  async remove(@Args('id', { type: () => ID }) id: string) {
    await this.companyService.remove(id);
    return true;
  }
}
