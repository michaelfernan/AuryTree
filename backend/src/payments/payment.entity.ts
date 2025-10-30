import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import {
  ObjectType,
  Field,
  ID,
  registerEnumType,
  GraphQLISODateTime,
} from "@nestjs/graphql";
import { Company } from "../companies/company.entity";
import { Expense } from "../expenses/expense.entity";
import { Employee } from "../employees/employee.entity";

// ---- Enums ----
export enum BeneficiaryType {
  EMPLOYEE = "employee",
  THIRDPARTY = "thirdParty",
  GOV = "gov",
}
registerEnumType(BeneficiaryType, { name: "BeneficiaryType" });

export enum PaymentSource {
  OWNER = "owner",
  COMPANY = "company",
}
registerEnumType(PaymentSource, { name: "PaymentSource" });

@ObjectType()
@Entity("payments")
export class Payment {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ type: "uuid" })
  companyId: string;

  @Field(() => Company)
  @ManyToOne(() => Company, (c) => c.payments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "companyId" })
  company: Company;

  @Field({ nullable: true })
  @Column({ type: "uuid", nullable: true })
  expenseId: string | null;

  @Field(() => Expense, { nullable: true })
  @ManyToOne(() => Expense, (e) => e.payments, { onDelete: "SET NULL" })
  @JoinColumn({ name: "expenseId" })
  expense: Expense | null;

  @Field({ nullable: true })
  @Column({ type: "uuid", nullable: true })
  employeeId: string | null;

  @Field(() => Employee, { nullable: true })
  @ManyToOne(() => Employee, (emp) => emp.payments, { onDelete: "SET NULL" })
  @JoinColumn({ name: "employeeId" })
  employee: Employee | null;

  @Field(() => BeneficiaryType)
  @Column({ type: "varchar", default: BeneficiaryType.THIRDPARTY })
  beneficiaryType: BeneficiaryType;

  @Field({ description: "Valor bruto (numeric armazenado como string)" })
  @Column({ type: "numeric", precision: 14, scale: 2 })
  grossAmount: string;

  @Column({ type: "jsonb", default: {} })
  deductionsJSON: Record<string, any>;

  @Field({ description: "Valor líquido (numeric armazenado como string)" })
  @Column({ type: "numeric", precision: 14, scale: 2 })
  netAmount: string;

  @Field(() => PaymentSource)
  @Column({ type: "varchar", default: PaymentSource.COMPANY })
  source: PaymentSource;

  // --- Corrige problema de GraphQLISODateTime ---
  @Column({ type: "date", nullable: true })
  private _paidAt: string | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  get paidAt(): Date | null {
    return this._paidAt ? new Date(this._paidAt) : null;
  }

  @Field({ nullable: true, description: "Competência YYYY-MM, se aplicável" })
  @Column({ type: "varchar", length: 7, nullable: true })
  competence: string | null;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;
}
