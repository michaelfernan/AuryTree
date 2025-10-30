import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Employee } from "./employee.entity";

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly repo: Repository<Employee>
  ) {}

  findAll(companyId: string): Promise<Employee[]> {
    return this.repo.find({
      where: { companyId },
      order: { createdAt: "DESC" },
    });
  }

  findOne(id: string): Promise<Employee | null> {
    return this.repo.findOne({ where: { id } });
  }

  create(input: Partial<Employee>): Promise<Employee> {
    const entity = this.repo.create(input);
    return this.repo.save(entity);
  }

  async update(id: string, patch: Partial<Employee>): Promise<Employee> {
    const current = await this.findOne(id);
    if (!current) throw new NotFoundException("Employee not found");
    const merged = this.repo.merge(current, patch);
    return this.repo.save(merged);
  }

  async remove(id: string): Promise<boolean> {
    const current = await this.findOne(id);
    if (!current) throw new NotFoundException("Employee not found");
    await this.repo.delete(id);
    return true;
  }
}
