import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Company } from "../companies/company.entity";
import { Employee } from "../employees/employee.entity";

@ObjectType()
@Entity("payroll_items")
export class PayrollItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ type: "uuid" })
  companyId: string;

  @Field(() => Company)
  @ManyToOne(() => Company, (c) => c.payrollItems, { onDelete: "CASCADE" })
  @JoinColumn({ name: "companyId" })
  company: Company;

  @Field()
  @Column({ type: "uuid" })
  employeeId: string;

  @Field(() => Employee)
  @ManyToOne(() => Employee, (emp) => emp.payrollItems, { onDelete: "CASCADE" })
  @JoinColumn({ name: "employeeId" })
  employee: Employee;

  @Field()
  @Column({ type: "varchar", length: 7 })
  competence: string; // "YYYY-MM"

  @Field()
  @Column({ type: "numeric", precision: 14, scale: 2 })
  gross: string;

  @Field()
  @Column({ type: "numeric", precision: 14, scale: 2 })
  inss: string;

  @Field()
  @Column({ type: "numeric", precision: 14, scale: 2 })
  fgts: string;

  // Mantemos no banco, mas sem expor diretamente no GraphQL
  @Column({ type: "jsonb", default: {} })
  otherDeductionsJSON: Record<string, any>;

  @Field()
  @Column({ type: "numeric", precision: 14, scale: 2 })
  net: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
