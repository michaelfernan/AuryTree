import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Invoice } from "./invoice.entity";

@Injectable()
export class InvoiceService {
  constructor(@InjectRepository(Invoice) private repo: Repository<Invoice>) {}

  findAll(companyId: string) {
    return this.repo.find({ where: { companyId } });
  }

  async create(input: Partial<Invoice>) {
    const entity = this.repo.create({
      ...input,
      issueDate: input.issueDate ? new Date(input.issueDate as any) : new Date(),
    });
    return this.repo.save(entity);
  }
}
