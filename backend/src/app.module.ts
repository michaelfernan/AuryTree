import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { join } from "path";

// 🧱 ENTIDADES
import { Company } from "./companies/company.entity";
import { User } from "./entities/user.entity";
import { Employee } from "./employees/employee.entity";
import { Invoice } from "./invoices/invoice.entity";
import { Expense } from "./expenses/expense.entity";
import { Payment } from "./payments/payment.entity";
import { PayrollItem } from "./payroll/payroll-item.entity";

// 🧩 RESOLVERS & SERVICES
import { CompanyResolver } from "./companies/company.resolver";
import { CompanyService } from "./companies/company.service";
import { EmployeeResolver } from "./employees/employee.resolver";
import { EmployeeService } from "./employees/employee.service";
import { InvoiceResolver } from "./invoices/invoice.resolver";
import { InvoiceService } from "./invoices/invoice.service";
import { ExpenseResolver } from "./expenses/expense.resolver";
import { ExpenseService } from "./expenses/expense.service";
import { PaymentResolver } from "./payments/payment.resolver";
import { PaymentService } from "./payments/payment.service";

// 🧩 PAYROLL
import { PayrollItemService } from "./payroll/payroll-item.service";
import { PayrollResolver } from "./payroll/payroll-item.resolver";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../.env"],
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "schema.gql"),
      playground: true,
      sortSchema: true,
    }),

    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      synchronize: true, // ⚠️ apenas em DEV
      autoLoadEntities: true,
      logging: true,
    }),

    TypeOrmModule.forFeature([
      Company,
      User,
      Employee,
      Invoice,
      Expense,
      Payment,
      PayrollItem,
    ]),
  ],

  providers: [
    // Resolvers + Services
    CompanyResolver,
    CompanyService,
    EmployeeResolver,
    EmployeeService,
    InvoiceResolver,
    InvoiceService,
    ExpenseResolver,
    ExpenseService,
    PaymentResolver,
    PaymentService,

    // Payroll
    PayrollResolver,       // generatePayroll mutation
    PayrollResolver,   // queries: payrollItems, payrollItem
    PayrollItemService,
  ],
})
export class AppModule {}
