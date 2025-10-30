// backend/src/app.module.ts
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { join } from "path";

// 🧱 ENTIDADES
import { Company } from "./companies/company.entity";
import { User } from "./users/user.entity";
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

// 🔐 AUTH (JWT)
import { AuthModule } from "./auth/auth.module";

// ▶️ USERS (direto no AppModule)
import { UserService } from "./users/user.service";
import { UserResolver } from "./users/user.resolver";

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
      context: ({ req }) => ({ req }),
    }),

    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      synchronize: true,
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

    AuthModule,
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

    // Users
    UserResolver,
    UserService,

    // Payroll
    PayrollResolver,
    PayrollItemService,
  ],
})
export class AppModule {}
