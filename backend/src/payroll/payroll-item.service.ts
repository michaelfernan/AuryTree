import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PayrollItem } from "./payroll-item.entity";
import { Repository } from "typeorm";

@Injectable()
export class PayrollItemService {
  constructor(
    @InjectRepository(PayrollItem)
    private repo: Repository<PayrollItem>,
  ) {}

  // Busca todos os payroll items de uma empresa e carrega o employee
  findAllByCompany(companyId: string) {
    return this.repo.find({
      where: { companyId },
      relations: ["employee"], // CARREGA RELACIONAMENTO
      order: { createdAt: "DESC" },
    });
  }

  // Busca 1 payroll item por ID e carrega employee
  findOne(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ["employee"], // CARREGA RELACIONAMENTO
    });
  }

  async create(input: Partial<PayrollItem>) {
    const item = await this.repo.save(this.repo.create(input));
    // recarrega item com employee
    return this.repo.findOne({ where: { id: item.id }, relations: ["employee"] });
  }

  async update(id: string, patch: Partial<PayrollItem>) {
    await this.repo.update({ id }, patch);
    return this.findOne(id);
  }

  async delete(id: string) {
    await this.repo.delete({ id });
    return true;
  }
}
