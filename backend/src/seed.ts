import "dotenv/config";
import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";

import ormconfig from "../ormconfig"; // DataSource
import { Company } from "./companies/company.entity";
import { User, UserRole } from "./entities/user.entity"; // << importa o enum
import { Employee } from "./employees/employee.entity";

async function run() {
  const ds = await (ormconfig as DataSource).initialize();

  // 1) Empresa
  const company = ds.getRepository(Company).create({
    name: "Aury3 LTDA",
    cnpj: "12.345.678/0001-90",
    regimeTributario: "Simples Nacional",
  });
  await ds.getRepository(Company).save(company);

  // 2) Usuário OWNER
  const passwordHash = await bcrypt.hash("aury123", 10);
  const user = ds.getRepository(User).create({
    name: "Michael (Owner)",
    email: "owner@aury3.dev",
    passwordHash,
    role: UserRole.OWNER, // << usa o enum aqui
    companyId: company.id,
  });
  await ds.getRepository(User).save(user);

  // 3) Funcionário vinculado (opcional)
  const emp = ds.getRepository(Employee).create({
    name: "Funcionário Teste",
    model: "CLT",
    baseSalary: "4500.00",
    admissionDate: new Date(),
    companyId: company.id,
    userId: null,
  });
  await ds.getRepository(Employee).save(emp);

  console.log("✅ Seed concluído:", {
    company: company.id,
    user: user.id,
    employee: emp.id,
  });
  await ds.destroy();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
