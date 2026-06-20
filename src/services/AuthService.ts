import type { SupabaseClient } from "@supabase/supabase-js";
import { AuthRepository } from "@/src/repositories/AuthRepository";
import type { Database, Profile } from "@/src/types/database";
import { AppError } from "@/src/utils/AppError";
import { loginSchema, type LoginInput } from "@/src/validators/AuthSchema";

export class AuthService {
  private readonly repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  static fromClient(client: SupabaseClient<Database>) {
    return new AuthService(new AuthRepository(client));
  }

  async login(input: LoginInput) {
    const parsed = loginSchema.parse(input);
    const sessionData = await this.repository.login(parsed.email, parsed.password);

    if (!sessionData.user) {
      throw new AppError("Authentication failed", {
        code: "AUTH_LOGIN_FAILED",
        status: 401,
      });
    }

    const profile = await this.repository.getProfile(sessionData.user.id);

    if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
      await this.repository.logout();

      throw new AppError("You are not authorized to access admin area", {
        code: "AUTH_NOT_ADMIN",
        status: 403,
      });
    }

    return {
      user: sessionData.user,
      session: sessionData.session,
      profile,
    };
  }

  async logout() {
    await this.repository.logout();
  }

  async getCurrentUser() {
    return this.repository.getCurrentUser();
  }

  async getProfile(): Promise<Profile | null> {
    const user = await this.repository.getCurrentUser();

    if (!user) {
      return null;
    }

    return this.repository.getProfile(user.id);
  }

  async requireAdminProfile(): Promise<Profile> {
    const profile = await this.getProfile();

    if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
      throw new AppError("Forbidden", {
        code: "AUTH_FORBIDDEN",
        status: 403,
      });
    }

    return profile;
  }
}
