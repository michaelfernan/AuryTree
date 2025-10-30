import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Company } from "../companies/company.entity";
import { User } from "../users/user.entity";
import { PayrollItem } from "../payroll/payroll-item.entity";
import { Payment } from "../payments/payment.entity";
import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
@Entity("employees")
export class Employee {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  // CLT, PJ, HORA etc.
  @Field({ description: "Modelo de contrato: CLT, PJ, HORA..." })
  @Column({ type: "varchar", default: "CLT" })
  model: string;

  @Field({
    description: "Salário base em formato numérico (string para precisão)",
  })
  @Column({ type: "numeric", precision: 14, scale: 2, default: 0 })
  baseSalary: string;

  @Field({ nullable: true })
  @Column({ type: "date", nullable: true })
  admissionDate: Date | null;

  @Field()
  @Column({ type: "uuid" })
  companyId: string;

  @Field(() => Company)
  @ManyToOne(() => Company, (c) => c.employees, { onDelete: "CASCADE" })
  @JoinColumn({ name: "companyId" })
  company: Company;

  @Field({ nullable: true })
  @Column({ type: "uuid", nullable: true })
  userId: string | null;

  @Field(() => User, { nullable: true })
  @OneToOne(() => User, (u) => u.employee, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "userId" })
  user: User | null;

  @Field(() => [PayrollItem], { nullable: true })
  @OneToMany(() => PayrollItem, (pi) => pi.employee)
  payrollItems: PayrollItem[];

  @Field(() => [Payment], { nullable: true })
  @OneToMany(() => Payment, (p) => p.employee)
  payments: Payment[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
