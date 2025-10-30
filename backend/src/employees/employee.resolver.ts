import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Employee } from "./employee.entity";
import { EmployeeService } from "./employee.service";
import { CreateEmployeeInput, UpdateEmployeeInput } from "./dto/employee.input";

@Resolver(() => Employee)
export class EmployeeResolver {
  constructor(private readonly svc: EmployeeService) {}

  // Consulta todos os funcionários de uma empresa
  @Query(() => [Employee])
  employees(@Args("companyId", { type: () => ID }) companyId: string) {
    return this.svc.findAll(companyId);
  }

  // Cria um funcionário
  @Mutation(() => Employee)
  createEmployee(@Args("input") input: CreateEmployeeInput) {
    const payload = {
      ...input,
      // Converte string ISO -> Date | null
      admissionDate: input.admissionDate ? new Date(input.admissionDate) : null,
      // Define valores padrão se não vier no input
      baseSalary: input.baseSalary ?? "0",
      model: input.model ?? "CLT",
    };
    return this.svc.create(payload);
  }

  // Atualiza um funcionário
  @Mutation(() => Employee)
  updateEmployee(@Args("input") input: UpdateEmployeeInput) {
    const { id, admissionDate, ...patch } = input;
    const normalized = {
      ...patch,
      admissionDate: admissionDate ? new Date(admissionDate) : undefined,
    };
    return this.svc.update(id, normalized);
  }
}
