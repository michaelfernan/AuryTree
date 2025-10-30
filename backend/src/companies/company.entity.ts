import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "@nestjs/graphql";
import { User } from "../entities/user.entity";
import { Employee } from "../employees/employee.entity";
import { Invoice } from "../invoices/invoice.entity";
import { Expense } from "../expenses/expense.entity";
import { PayrollItem } from "../payroll/payroll-item.entity";
import { Payment } from "../payments/payment.entity"; // ⬅️ faltava

@ObjectType("CompanyType")
@Entity("companies")
export class Company {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  cnpj: string;

  @Field({ nullable: true })
  @Column({ default: "Simples Nacional" })
  regimeTributario: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => [User], { nullable: true })
  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @Field(() => [Employee], { nullable: true })
  @OneToMany(() => Employee, (emp) => emp.company)
  employees: Employee[];

  @Field(() => [Invoice], { nullable: true })
  @OneToMany(() => Invoice, (inv) => inv.company)
  invoices: Invoice[];

  @Field(() => [Expense], { nullable: true })
  @OneToMany(() => Expense, (exp) => exp.company)
  expenses: Expense[];

  @Field(() => [PayrollItem], { nullable: true })
  @OneToMany(() => PayrollItem, (pi) => pi.company)
  payrollItems: PayrollItem[];

  @Field(() => [Payment], { nullable: true })
  @OneToMany(() => Payment, (p) => p.company)
  payments: Payment[];
}
