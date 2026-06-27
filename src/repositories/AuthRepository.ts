import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database, Profile } from "@/src/types/database";
import { AppError } from "@/src/utils/AppError";

export class AuthRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async login(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });

    if (error) {
      throw new AppError(error.message, {
        code: "AUTH_LOGIN_FAILED",
        status: 401,
        cause: error,
      });
    }

    return data;
  }

  async logout() {
    const { error } = await this.client.auth.signOut();

    if (error) {
      throw new AppError(error.message, {
        code: "AUTH_LOGOUT_FAILED",
        status: 500,
        cause: error,
      });
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await this.client.auth.getUser();

    if (error) {
      throw new AppError(error.message, {
        code: "AUTH_USER_FETCH_FAILED",
        status: 401,
        cause: error,
      });
    }

    return data.user;
  }

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.client.from("profiles").select("*").eq("user_id", userId).maybeSingle();

    if (error) {
      throw new AppError(error.message, {
        code: "AUTH_PROFILE_FETCH_FAILED",
        status: 500,
        cause: error,
      });
    }

    return data;
  }

  async updateProfile(userId: string, payload: { name: string; phone: string | null }): Promise<Profile> {
    const { data, error } = await this.client
      .from("profiles")
      .update({ name: payload.name, phone: payload.phone })
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) {
      throw new AppError(error.message, {
        code: "AUTH_PROFILE_UPDATE_FAILED",
        status: 500,
        cause: error,
      });
    }

    if (!data) {
      throw new AppError("Profile could not be updated", { code: "AUTH_PROFILE_UPDATE_FAILED", status: 500 });
    }

    return data;
  }

  async updateEmail(email: string): Promise<void> {
    const { error } = await this.client.auth.updateUser({ email });

    if (error) {
      throw new AppError(error.message, {
        code: "AUTH_EMAIL_UPDATE_FAILED",
        status: 400,
        cause: error,
      });
    }
  }

  async updatePassword(password: string): Promise<void> {
    const { error } = await this.client.auth.updateUser({ password });

    if (error) {
      throw new AppError(error.message, {
        code: "AUTH_PASSWORD_UPDATE_FAILED",
        status: 400,
        cause: error,
      });
    }
  }
}
