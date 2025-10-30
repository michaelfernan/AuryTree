import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../users/user.entity";

// Chave usada pelo Guard
export const ROLES_KEY = "roles";

// Decorator para aplicar em resolvers/mutations
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
