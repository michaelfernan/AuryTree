import "dotenv/config";
import * as bcrypt from "bcryptjs";
import ormconfig from "../ormconfig"; // já é DataSource
import { Company } from "./companies/company.entity";
import { User, UserRole } from "./users/user.entity";
import { Employee } from "./employees/employee.entity";

async function run() {
  try {
    // inicializa o DataSource
    await ormconfig.initialize();

    // 1️⃣ Empresa
    const companyRepo = ormconfig.getRepository(Company);
    const company = companyRepo.create({
      name: "Aury3 LTDA",
      cnpj: "12.345.678/0001-90",
      regimeTributario: "Simples Nacional",
    });
    await companyRepo.save(company);

    // 2️⃣ Usuário OWNER
    const userRepo = ormconfig.getRepository(User);
    const passwordHash = await bcrypt.hash("aury123", 10);
    const user = userRepo.create({
      name: "Michael (Owner)",
      email: "owner@aury3.dev",
      passwordHash,
      role: UserRole.OWNER,
      companyId: company.id,
    });
    await userRepo.save(user);

    // 3️⃣ Funcionário
    const employeeRepo = ormconfig.getRepository(Employee);
    const emp = employeeRepo.create({
      name: "Funcionário Teste",
      model: "CLT",
      baseSalary: "4500.00",
      admissionDate: new Date(),
      companyId: company.id,
      userId: null,
    });
    await employeeRepo.save(emp);

    console.log("✅ Seed concluído com sucesso:");
    console.table({
      company: company.id,
      user: user.id,
      employee: emp.id,
    });
  } catch (error) {
    console.error("❌ Erro no seed:", error);
  } finally {
    await ormconfig.destroy();
  }
}

run();
