import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { UseGuards, ForbiddenException } from "@nestjs/common";
import { User } from "./user.entity";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { UserRole } from "./user.entity";
import { CreateUserInput, UpdateUserInput } from "./dto/user.input";
import { UserService } from "./user.service";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // 🔹 Retorna todos os usuários da empresa do usuário logado
  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async users(@CurrentUser() user: User): Promise<User[]> {
    if (!user.companyId) throw new ForbiddenException("Usuário sem empresa associada");
    return this.userService.findByCompany(user.companyId);
  }

  // 🔹 Retorna um usuário específico da mesma empresa
  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async user(
    @CurrentUser() user: User,
    @Args("id", { type: () => ID }) id: string
  ): Promise<User> {
    const target = await this.userService.findOne(id);
    if (!target || target.companyId !== user.companyId) {
      throw new ForbiddenException("Acesso negado: usuário não pertence à sua empresa");
    }
    return target;
  }

  // 🔹 Cria um novo usuário (Owner/Admin apenas)
  @Mutation(() => User)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async createUser(
    @CurrentUser() user: User,
    @Args("input") input: CreateUserInput
  ): Promise<User> {
    if (!user.companyId) throw new ForbiddenException("Usuário sem empresa associada");
    return this.userService.create({ ...input, companyId: user.companyId });
  }

  // 🔹 Atualiza um usuário existente (Owner/Admin apenas)
  @Mutation(() => User)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async updateUser(
    @CurrentUser() user: User,
    @Args("input") input: UpdateUserInput
  ): Promise<User> {
    const target = await this.userService.findOne(input.id);
    if (!target || target.companyId !== user.companyId) {
      throw new ForbiddenException("Acesso negado: usuário não pertence à sua empresa");
    }
    return this.userService.update(input.id, input);
  }

  // 🔹 Deleta um usuário (Owner/Admin apenas)
  @Mutation(() => Boolean)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async deleteUser(
    @CurrentUser() user: User,
    @Args("id", { type: () => ID }) id: string
  ): Promise<boolean> {
    const target = await this.userService.findOne(id);
    if (!target || target.companyId !== user.companyId) {
      throw new ForbiddenException("Acesso negado: usuário não pertence à sua empresa");
    }
    await this.userService.delete(id);
    return true;
  }

  // 🔹 Debug: retorna o usuário logado
  @Query(() => String)
  @UseGuards(GqlAuthGuard)
  whoami(@CurrentUser() user: User): string {
    return `Logado como: ${user.email} (role: ${user.role})`;
  }
}
