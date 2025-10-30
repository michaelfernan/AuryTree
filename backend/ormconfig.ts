// backend/ormconfig.ts
import { DataSource } from "typeorm";
import "dotenv/config";
import { join } from "path";
import { Company } from "./src/companies/company.entity";
import { User } from "./src/users/user.entity";
import { Employee } from "./src/employees/employee.entity";
import { Invoice } from "./src/invoices/invoice.entity";
import { Expense } from "./src/expenses/expense.entity";
import { Payment } from "./src/payments/payment.entity";
import { PayrollItem } from "./src/payroll/payroll-item.entity";

export default new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL || "postgres://user:password@localhost:5432/aury3",
  entities: [
    Company,
    User,
    Employee,
    Invoice,
    Expense,
    Payment,
    PayrollItem,
    join(__dirname, "src/**/*.entity{.ts,.js}"), // fallback para todas as entidades
  ],
  migrations: [join(__dirname, "src/migrations/*{.ts,.js}")],
  synchronize: true, // ⚠️ usar true só em dev, false em produção
  logging: true,
});
