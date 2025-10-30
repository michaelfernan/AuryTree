import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly repo: Repository<Company>,
  ) {}

  // 🔍 Lista todas as empresas
  findAll(): Promise<Company[]> {
    return this.repo.find();
  }

  // 🔍 Busca uma empresa pelo ID
  async findOne(id: string): Promise<Company> {
    const company = await this.repo.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }
    return company;
  }

  // 🧱 Cria uma nova empresa
  async create(input: Partial<Company>): Promise<Company> {
    const entity = this.repo.create(input);
    return this.repo.save(entity);
  }

  // ✏️ Atualiza uma empresa existente
  async update(id: string, input: Partial<Company>): Promise<Company> {
    const company = await this.findOne(id);
    Object.assign(company, input);
    return this.repo.save(company);
  }

  // ❌ Remove uma empresa
  async remove(id: string): Promise<boolean> {
    const company = await this.repo.findOne({ where: { id } });
    if (!company) return false;

    await this.repo.delete(id);
    return true;
  }
}
