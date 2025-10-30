import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectType, Field, ID, registerEnumType, GraphQLISODateTime } from "@nestjs/graphql";
import { Company } from "../companies/company.entity";

export enum InvoiceType {
  ENTRADA = "ENTRADA",
  SAIDA = "SAIDA",
}
registerEnumType(InvoiceType, { name: "InvoiceType" });

export enum ImportStatus {
  IMPORTED = "imported",
  VALIDATED = "validated",
}
registerEnumType(ImportStatus, { name: "ImportStatus" });

@ObjectType()
@Entity("invoices")
export class Invoice {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ type: "uuid" })
  companyId: string;

  @Field(() => Company)
  @ManyToOne(() => Company, (c) => c.invoices, { onDelete: "CASCADE" })
  @JoinColumn({ name: "companyId" })
  company: Company;

  @Field(() => InvoiceType)
  @Column({ type: "varchar" })
  type: InvoiceType;

  @Field({ nullable: true })
  @Column({ type: "varchar", nullable: true })
  nfeKey: string | null;

  @Field(() => GraphQLISODateTime)
  @Column({ type: "date" })
  issueDate: Date;

  @Field({ nullable: true })
  @Column({ type: "varchar", nullable: true })
  partnerCnpj: string | null;

  @Field()
  @Column({ type: "numeric", precision: 14, scale: 2 })
  total: string;

  @Column({ type: "jsonb", default: {} })
  taxesJSON: Record<string, any>;

  @Column({ type: "jsonb", default: [] })
  itemsJSON: any[];

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  rawXml: string | null;

  @Field(() => ImportStatus)
  @Column({ type: "varchar", default: ImportStatus.IMPORTED })
  status: ImportStatus;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;
}
