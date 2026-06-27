import type { SupabaseClient } from "@supabase/supabase-js";
import { AuthRepository } from "@/src/repositories/AuthRepository";
import type { Database, Profile } from "@/src/types/database";
import { AppError } from "@/src/utils/AppError";
import { loginSchema, type LoginInput } from "@/src/validators/AuthSchema";
import {
  emailSchema,
  passwordSchema,
  profileSchema,
  type EmailInput,
  type PasswordInput,
  type ProfileInput,
} from "@/src/validators/ProfileSchema";

export interface Account {
  email: string | null;
  profile: Profile | null;
}

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

  async getAccount(): Promise<Account> {
    const user = await this.repository.getCurrentUser();

    if (!user) {
      return { email: null, profile: null };
    }

    const profile = await this.repository.getProfile(user.id);

    return { email: user.email ?? null, profile };
  }

  async updateProfile(input: ProfileInput): Promise<Profile> {
    const parsed = profileSchema.parse(input);
    const user = await this.repository.getCurrentUser();

    if (!user) {
      throw new AppError("Not authenticated", { code: "AUTH_REQUIRED", status: 401 });
    }

    return this.repository.updateProfile(user.id, {
      name: parsed.name,
      phone: parsed.phone?.trim() ? parsed.phone.trim() : null,
    });
  }

  async updateEmail(input: EmailInput): Promise<void> {
    const parsed = emailSchema.parse(input);
    await this.repository.updateEmail(parsed.email);
  }

  async updatePassword(input: PasswordInput): Promise<void> {
    const parsed = passwordSchema.parse(input);
    await this.repository.updatePassword(parsed.password);
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
