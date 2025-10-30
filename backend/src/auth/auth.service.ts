// backend/src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/user.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  // Retorna o usuário criado (sem passwordHash)
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<Partial<User>> {
    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) throw new ConflictException("Usuário já existe");

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = this.usersRepo.create({ name, email, passwordHash });

    try {
      await this.usersRepo.save(user);
    } catch (err: any) {
      // proteger contra race condition / unique constraint
      if (/(unique|duplicate)/i.test(err?.message || "")) {
        throw new ConflictException("Usuário já existe");
      }
      throw new InternalServerErrorException("Erro ao salvar usuário");
    }

    const { passwordHash: _, ...rest } = user as any;
    return rest as Partial<User>;
  }

  // Valida as credenciais e retorna user safe ou null
  async validateUser(
    email: string,
    password: string
  ): Promise<Partial<User> | null> {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return null;

    const { passwordHash: _, ...rest } = user as any;
    return rest as Partial<User>;
  }

  // Faz login e retorna token + user safe
  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: Partial<User> }> {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException("Credenciais inválidas");

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException("Credenciais inválidas");

    const payload = { sub: user.id, email: user.email, role: user.role };
    // usar signAsync para compatibilidade com JwtModule.registerAsync
    const token = await this.jwtService.signAsync(payload);

    const { passwordHash: _, ...userSafe } = user as any;
    return { token, user: userSafe };
  }

  async findById(id: string): Promise<Partial<User> | null> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) return null;
    const { passwordHash: _, ...rest } = user as any;
    return rest as Partial<User>;
  }
}
