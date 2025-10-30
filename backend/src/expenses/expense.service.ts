import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Expense } from "./expense.entity";

@Injectable()
export class ExpenseService {
  constructor(@InjectRepository(Expense) private repo: Repository<Expense>) {}

  findAll(companyId: string) {
    return this.repo.find({ where: { companyId } });
  }

  async create(input: Partial<Expense>) {
    const entity = this.repo.create({
      ...input,
      dueDate: input.dueDate ? new Date(input.dueDate as any) : null,
      paidAt: input.paidAt ? new Date(input.paidAt as any) : null,
    });
    return this.repo.save(entity);
  }
}
