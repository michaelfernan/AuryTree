import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { Employee } from "./employee.entity";
import { EmployeeService } from "./employee.service";
import { CreateEmployeeInput, UpdateEmployeeInput } from "./dto/employee.input";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { User } from "../users/user.entity";

@Resolver(() => Employee)
export class EmployeeResolver {
  constructor(private readonly svc: EmployeeService) {}

  // Consulta todos os funcionários da empresa do usuário logado
  @Query(() => [Employee])
  @UseGuards(GqlAuthGuard)
  employees(@CurrentUser() user: User) {
    return this.svc.findAll(user.companyId);
  }

  // Cria um funcionário vinculado à empresa do usuário logado
  @Mutation(() => Employee)
  @UseGuards(GqlAuthGuard)
  createEmployee(
    @CurrentUser() user: User,
    @Args("input") input: CreateEmployeeInput
  ) {
    const payload = {
      ...input,
      companyId: user.companyId, // ⚡ garante que só a empresa logada cria
      admissionDate: input.admissionDate ? new Date(input.admissionDate) : null,
      baseSalary: input.baseSalary ?? "0",
      model: input.model ?? "CLT",
    };
    return this.svc.create(payload);
  }

  // Atualiza um funcionário, mas só se ele pertencer à empresa do usuário logado
  @Mutation(() => Employee)
  @UseGuards(GqlAuthGuard)
  async updateEmployee(
    @CurrentUser() user: User,
    @Args("input") input: UpdateEmployeeInput
  ) {
    const { id, admissionDate, ...patch } = input;

    // ⚡ garante que o funcionário pertence à empresa do usuário
    const employee = await this.svc.findOne(id);
    if (!employee || employee.companyId !== user.companyId) {
      throw new Error("Acesso negado: funcionário não pertence à sua empresa");
    }

    const normalized = {
      ...patch,
      admissionDate: admissionDate ? new Date(admissionDate) : undefined,
    };
    return this.svc.update(id, normalized);
  }
}

