import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectType, Field, ID, registerEnumType } from "@nestjs/graphql";
import { Company } from "../companies/company.entity";
import { Employee } from "../employees/employee.entity";

// Enum para papéis do usuário
export enum UserRole {
  OWNER = "OWNER",
  ACCOUNTANT = "ACCOUNTANT",
  EMPLOYEE = "EMPLOYEE",
  ADMIN = "ADMIN",
}

// Registrar enum no schema GraphQL
registerEnumType(UserRole, { name: "UserRole" });

@ObjectType()
@Entity("users")
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  // ❌ não expor senha no GraphQL
  @Column()
  passwordHash: string;

  @Field(() => UserRole)
  @Column({ type: "varchar", default: UserRole.OWNER })
  role: UserRole;

  @Field({ nullable: true })
  @Column({ type: "uuid", nullable: true })
  companyId: string | null;

  @Field(() => Company, { nullable: true })
  @ManyToOne(() => Company, (c) => c.users, { onDelete: "SET NULL" })
  @JoinColumn({ name: "companyId" })
  company: Company | null;

  @Field(() => Employee, { nullable: true })
  @OneToOne(() => Employee, (emp) => emp.user)
  employee?: Employee;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
