import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";
import { User, UserRole } from "./user.entity";
import { CreateUserInput, UpdateUserInput } from "./dto/user.input";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  // 🔹 Retorna todos os usuários de uma empresa
  findByCompany(companyId: string): Promise<User[]> {
    return this.userRepo.find({ where: { companyId } });
  }

  // 🔹 Retorna um usuário pelo ID
  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException("Usuário não encontrado");
    return user;
  }

  // 🔹 Cria um novo usuário
  async create(input: CreateUserInput & { companyId: string }): Promise<User> {
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = this.userRepo.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role ?? UserRole.OWNER, // ✅ usar enum, não string literal
      companyId: input.companyId,
    });
    return this.userRepo.save(user);
  }

  // 🔹 Atualiza um usuário existente
  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.findOne(id);

    if (input.password) {
      input.password = await bcrypt.hash(input.password, 10);
    }

    // Se input.role vier como string, converte para enum
    if (input.role && !(Object.values(UserRole) as string[]).includes(input.role)) {
      throw new Error("Role inválida");
    }

    Object.assign(user, input);
    return this.userRepo.save(user);
  }

  // 🔹 Deleta um usuário
  async delete(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }
}
