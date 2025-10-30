import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PayrollItem } from "./payroll-item.entity";
import { PayrollItemService } from "./payroll-item.service";
import { EmployeeService } from "../employees/employee.service";

@Resolver(() => PayrollItem)
export class PayrollResolver {
  constructor(
    private readonly payrollSvc: PayrollItemService,
    private readonly employeeSvc: EmployeeService
  ) {}

  // 🔹 Mutation para gerar folha de pagamento
  @Mutation(() => [PayrollItem])
  async generatePayroll(
    @Args("companyId", { type: () => ID }) companyId: string,
    @Args("competence") competence: string
  ): Promise<PayrollItem[]> {
    const employees = await this.employeeSvc.findAll(companyId);
    const payrollItems: PayrollItem[] = [];

    for (const emp of employees) {
      const gross = Number(emp.baseSalary);
      const inss = gross * 0.08;
      const fgts = gross * 0.08;
      const net = gross - inss - fgts;

      const item = await this.payrollSvc.create({
        companyId,
        employeeId: emp.id,
        competence,
        gross: gross.toFixed(2),
        inss: inss.toFixed(2),
        fgts: fgts.toFixed(2),
        net: net.toFixed(2),
      });

      payrollItems.push(item);
    }

    return payrollItems;
  }

  // 🔹 Query para todos os payrollItems de uma empresa
  @Query(() => [PayrollItem])
  async payrollItems(
    @Args("companyId", { type: () => ID }) companyId: string
  ): Promise<PayrollItem[]> {
    return this.payrollSvc.findAllByCompany(companyId);
  }

  // 🔹 Query para um payrollItem específico por ID
  @Query(() => PayrollItem, { nullable: true })
  async payrollItem(
    @Args("id", { type: () => ID }) id: string
  ): Promise<PayrollItem | null> {
    return this.payrollSvc.findOne(id);
  }
}
