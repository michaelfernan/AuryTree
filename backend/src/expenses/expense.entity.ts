import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectType, Field, ID, registerEnumType, GraphQLISODateTime } from "@nestjs/graphql";
import { Company } from "../companies/company.entity";
import { Payment } from "../payments/payment.entity";

export enum ExpenseOrigin {
  MANUAL = "manual",
  INVOICE = "invoice",
}
registerEnumType(ExpenseOrigin, { name: "ExpenseOrigin" });

@ObjectType()
@Entity("expenses")
export class Expense {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ type: "uuid" })
  companyId: string;

  @Field(() => Company)
  @ManyToOne(() => Company, (c) => c.expenses, { onDelete: "CASCADE" })
  @JoinColumn({ name: "companyId" })
  company: Company;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column({ type: "numeric", precision: 14, scale: 2 })
  amount: string;

  @Field({ nullable: true })
  @Column({ type: "varchar", nullable: true })
  category: string | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: "date", nullable: true })
  dueDate: Date | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: "date", nullable: true })
  paidAt: Date | null;

  @Field(() => ExpenseOrigin)
  @Column({ type: "varchar", default: ExpenseOrigin.MANUAL })
  origin: ExpenseOrigin;

  @Field({ nullable: true })
  @Column({ type: "uuid", nullable: true })
  invoiceId: string | null;

  @Field(() => [Payment], { nullable: true })
  @OneToMany(() => Payment, (p) => p.expense)
  payments: Payment[];

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;
}
