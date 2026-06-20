export class AppError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly cause?: unknown;

  constructor(message: string, options?: { code?: string; status?: number; cause?: unknown }) {
    super(message);
    this.name = "AppError";
    this.code = options?.code ?? "APP_ERROR";
    this.status = options?.status ?? 500;
    this.cause = options?.cause;
  }
}

export function toAppError(error: unknown, fallbackMessage = "Something went wrong"): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message || fallbackMessage, {
      cause: error,
      code: "UNEXPECTED_ERROR",
      status: 500,
    });
  }

  return new AppError(fallbackMessage, {
    cause: error,
    code: "UNEXPECTED_ERROR",
    status: 500,
  });
}
